import {
	type IExecuteFunctions,
	type IHttpRequestOptions,
	type ILoadOptionsFunctions,
	type NodeParameterValueType,
	type ResourceMapperField,
	WorkflowConfigurationError,
} from 'n8n-workflow';
import {
	type RicApiCred,
	RicApiCredName,
	type RicModelConfigDescriptor,
	type RicModelDataDescriptor,
} from './types.js';

/**
 * Cast selected keys to lowercase for CI substring search
 * todo: go over use cases and convert to fuzzy API search when/if it becomes available
 */
export function toSearchable<T extends object>(item: T, ...fields: (keyof T)[]): string {
	return fields
		.map((field) => (field in item ? String(item[field]).toLowerCase() : ''))
		.filter((part) => part !== '')
		.join(' ');
}

export function isCiStringInProps<T extends object>(
	lookup: string,
	item: T,
	...fields: (keyof T)[]
): boolean {
	return toSearchable(item, ...fields).includes(lookup.toLowerCase());
}

export function readResourceLocatorId(
	node: ILoadOptionsFunctions,
	option: string,
): NodeParameterValueType {
	const idOption = node.getCurrentNodeParameter(option);
	if (
		idOption &&
		typeof idOption === 'object' &&
		'__rl' in idOption &&
		idOption.__rl &&
		idOption.value
	) {
		return idOption.value;
	}
	return undefined;
}

export async function httpCall(
	exec: ILoadOptionsFunctions | IExecuteFunctions,
	request: IHttpRequestOptions,
): Promise<unknown> {
	const cred = await exec.getCredentials<RicApiCred>(RicApiCredName);
	if (!request.url) {
		throw new WorkflowConfigurationError(
			exec.getNode(),
			'Service URL was not set up, but workflow was executed.',
		);
	}
	if (!request.url.startsWith('http')) {
		request.url = cred.ricServer.replace(/\/+$/g, '') + request.url;
	}
	return exec.helpers.httpRequestWithAuthentication.call(exec, RicApiCredName, request);
}

/**
 * Sets a value at a dot‑separated path inside an object, creating intermediate
 * plain objects only when needed. Never overwrites existing objects.
 */
export function setNestedValue(
	target: Record<string, unknown>,
	path: string,
	value: unknown,
): void {
	if (!path.includes('.')) {
		target[path] = value;
		return;
	}
	const keys = path.split('.');
	let current: Record<string, unknown> = target;
	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		const next = current[key];
		// If the next level is already a plain object, use it.
		if (next !== null && typeof next === 'object' && !Array.isArray(next)) {
			current = next as Record<string, unknown>;
		} else {
			// Otherwise create a fresh object (and never overwrite an array, etc.)
			const newObj: Record<string, unknown> = {};
			current[key] = newObj;
			current = newObj;
		}
	}
	current[keys[keys.length - 1]] = value;
}

export function ricConfigToResourceMapperField(
	config: RicModelConfigDescriptor,
): ResourceMapperField {
	return {
		id: `config.${config.id}`,
		displayName: config.name,
		type:
			config.dataType === 'table'
				? 'string'
				: config.ctrl === 'Select'
					? 'options'
					: config.dataType,
		required: false,
		defaultValue: config.defaultValue,
		defaultMatch: false,
		display: true,
		options: config.ctrl === 'Select' && config.opts ? config.opts.items : undefined,
	};
}

export function capitalise(some: string): string {
	return some.charAt(0).toUpperCase() + some.slice(1);
}

export function unrollModelDescriptors(
	data: RicModelDataDescriptor,
	idPrefix: string,
	namePrefix: string,
): RicModelDataDescriptor[] {
	const children =
		data.type === 'subsystem' || data.type === 'argument'
			? (data.children ?? []).flatMap((c) =>
					unrollModelDescriptors(c, `${data.id}.`, `${data.name}: `),
				)
			: [];
	return [
		{
			...data,
			id: `${idPrefix}${data.id}`,
			name: `${namePrefix}${data.name}`,
		},
		...children,
	];
}

/**
 * Parses the filename from a Content-Disposition header value.
 *
 * Supports:
 * - `filename="example.txt"`
 * - `filename*=UTF-8''na%C3%AFve%20file.txt`
 * - Fallback from `filename*` to `filename` if the former is absent
 *
 * Returns `undefined` if no filename can be extracted or the input is invalid.
 */
export function parseContentDispositionFileName(header: string): string | undefined {
	if (!header) {
		return undefined;
	}
	const parameters = header
		.split(';')
		.map((param) => param.trim())
		.filter((param) => param.length > 0);
	let fileNameStar: string | undefined;
	let fileName: string | undefined;
	for (const param of parameters) {
		const eqIndex = param.indexOf('=');
		if (eqIndex === -1) {
			continue;
		}
		const key = param.slice(0, eqIndex).trim().toLowerCase();
		let value = param.slice(eqIndex + 1).trim();
		// Remove surrounding quotes (single or double) if present
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		if (key === 'filename*') {
			// RFC 5987: value format is `charset''percent-encoded-name`
			const parts = value.split("''");
			if (parts.length > 1) {
				const encodedFileName = parts.slice(1).join("''"); // join in case of extraneous quotes
				try {
					fileNameStar = decodeURIComponent(encodedFileName);
				} catch {
					// If decoding fails, fall back to the raw value
					fileNameStar = encodedFileName;
				}
			} else {
				// Malformed, treat as plain text
				fileNameStar = value;
			}
		} else if (key === 'filename') {
			// Try to decode percent-encoding, as some servers encode the filename
			if (value.includes('%')) {
				try {
					fileName = decodeURIComponent(value);
				} catch {
					fileName = value;
				}
			} else {
				fileName = value;
			}
		}
	}
	// Prefer the extended filename* if it exists
	return fileNameStar !== undefined ? fileNameStar : fileName;
}

/**
 * Returns the timezone offset in minutes for a given IANA timezone name.
 * The offset follows the same sign as `Date.getTimezoneOffset()`:
 *   - positive means the timezone is **behind** UTC (west)
 *   - negative means the timezone is **ahead** of UTC (east)
 *
 * @param timezone - an IANA timezone name, e.g. "Europe/Moscow"
 * @returns The current offset in minutes (e.g. -180 for UTC+3)
 * @throws RangeError if the timezone string is invalid
 */
export function timezoneNameToOffset(timezone: string): number {
	// Validate the timezone by trying to construct a DateTimeFormat with it.
	// An invalid timezone will throw a RangeError.
	try {
		new Intl.DateTimeFormat('en-US', { timeZone: timezone });
	} catch (e) {
		throw new RangeError(`Invalid time zone: ${timezone}`, { cause: e });
	}

	const date = new Date();

	// Use 'shortOffset' to get a string like "GMT+3" or "UTC-5:30"
	const dtf = new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		timeZoneName: 'shortOffset',
	});

	const parts = dtf.formatToParts(date);
	const tzPart = parts.find((part) => part.type === 'timeZoneName');

	if (!tzPart) {
		throw new Error('Unable to obtain timezone offset string');
	}

	const tzName = tzPart.value;

	// Parse the offset string. Examples: "GMT+3", "UTC-5:30", "GMT+10"
	const match = tzName.match(/(?:GMT|UTC)([+-])(\d{1,2})(?::(\d{2}))?/i);
	if (!match) {
		throw new Error(`Unexpected timezone name format: ${tzName}`);
	}

	const sign = match[1] === '+' ? 1 : -1;
	const hours = parseInt(match[2], 10);
	const minutes = match[3] ? parseInt(match[3], 10) : 0;
	const utcOffsetMinutes = sign * (hours * 60 + minutes);

	// Invert sign to match JavaScript's getTimezoneOffset() convention
	return -utcOffsetMinutes;
}
