import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { httpCall, isCiStringInProps } from '../../common/util.js';

interface ReportBuild {
	_id: string;
	createdAt: number;
	payload: {
		from: number;
		to: number;
		objects: string[];
	};
}

/** Formats a UTC ms timestamp; omits the time when it is midnight (00:00) */
function formatSmartUTC(ms: number): string {
	const d = new Date(ms);
	const DD = String(d.getUTCDate()).padStart(2, '0');
	const MM = String(d.getUTCMonth() + 1).padStart(2, '0');
	const YY = String(d.getUTCFullYear()).slice(-2);
	const hh = String(d.getUTCHours()).padStart(2, '0');
	const mm = String(d.getUTCMinutes()).padStart(2, '0');

	// Omit the time part when it is exactly midnight
	if (hh === '00' && mm === '00') {
		return `${DD}.${MM}.${YY}`;
	}
	return `${DD}.${MM}.${YY} ${hh}:${mm}`;
}

/** Returns true if two UTC timestamps share the same year, month, and day */
function sameUTCDate(a: number, b: number): boolean {
	const da = new Date(a);
	const db = new Date(b);
	return (
		da.getUTCFullYear() === db.getUTCFullYear() &&
		da.getUTCMonth() === db.getUTCMonth() &&
		da.getUTCDate() === db.getUTCDate()
	);
}

function createLabel(report: ReportBuild): string {
	const { from, to, objects } = report.payload;
	const count = objects.length;
	const objWord = count === 1 ? 'object' : 'objects';

	const fromStr = formatSmartUTC(from);

	let toStr: string;
	if (sameUTCDate(from, to)) {
		const dTo = new Date(to);
		const toHH = String(dTo.getUTCHours()).padStart(2, '0');
		const toMM = String(dTo.getUTCMinutes()).padStart(2, '0');

		// When 'to' is midnight on the same day, fall back to the full (date‑only) string
		if (toHH === '00' && toMM === '00') {
			toStr = formatSmartUTC(to); // will be just the date
		} else {
			toStr = `${toHH}:${toMM}`;
		}
	} else {
		toStr = formatSmartUTC(to);
	}

	const createdStr = formatSmartUTC(report.createdAt);

	return `${count} ${objWord} ${fromStr} - ${toStr} (${createdStr})`;
}

export async function listReportBuilds(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const responseData = (await httpCall(this, {
		method: 'GET',
		url: '/api/v1/reports/builds?only=_id,createdAt,payload',
		json: true,
	})) as ReportBuild[];
	// todo: a slightly better ux can be had if reports were filtered for:
	//  cancellable - pending, queued, processing
	//  exportable - completed
	const results: INodeListSearchItems[] = responseData
		.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
		.map((r) => ({ _id: r._id, name: createLabel(r) }))
		.filter((i) => !filter || isCiStringInProps(filter, i, '_id', 'name'))
		.map((item) => ({
			name: item.name,
			value: item._id,
		}));
	return { results, paginationToken: undefined };
}
