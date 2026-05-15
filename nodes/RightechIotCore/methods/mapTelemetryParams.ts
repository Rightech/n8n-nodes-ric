import type { ILoadOptionsFunctions, ResourceMapperFields } from 'n8n-workflow';
import type { FieldType, INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import type { RicPerObjectModelDeepAndFlat, RicTelemetryDataTypes } from '../common/types.js';
import { capitalise, httpCall } from '../common/util.js';

type SupportedFieldType = FieldType & ('number' | 'boolean' | 'string' | 'object' | 'array');

const RicToN8nDataTypeMap: Record<RicTelemetryDataTypes, SupportedFieldType> = {
	number: 'number',
	boolean: 'boolean',
	string: 'string',
	object: 'object',
	'number[]': 'array',
	'boolean[]': 'array',
	'string[]': 'array',
};

export async function mapTelemetryParams(
	this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
	const objectId = this.getCurrentNodeParameter('objectId') as INodeParameterResourceLocator;
	if (!objectId?.value) {
		return {
			fields: [],
			emptyFieldsNotice: 'Select an object to discover telemetry parameters.',
		};
	}
	try {
		const modelData = (await httpCall(this, {
			method: 'GET',
			url: `/api/v1/objects/${objectId.value}/model`,
			json: true,
		})) as RicPerObjectModelDeepAndFlat;
		const telemetryParams = modelData._arguments
			.filter((a) => a.active)
			.filter((a) => a.id !== '_ts') // note: system controlled value
			.sort(
				(a, b) =>
					(a._base ? (b._base ? 0 : -1) : 1) ||
					(a._parentId ?? '')?.localeCompare(b._parentId ?? '') ||
					a.name.localeCompare(b.name),
			);
		return {
			fields: telemetryParams.map((a) => ({
				id: a.id,
				displayName: a._base
					? `Basic: ${a.name}`
					: a._parentId
						? `${capitalise(a._parentId).replace('-', ' ')}: ${a.name}`
						: a.name,
				type: RicToN8nDataTypeMap[a.dataType],
				required: false,
				defaultMatch: false,
				display: true,
			})),
			emptyFieldsNotice:
				telemetryParams.length === 0
					? 'Object does not have any routed telemetry parameters.'
					: undefined,
		};
	} catch (error) {
		return {
			fields: [],
			emptyFieldsNotice: `Failed to load configuration: ${error.toString()}`,
		};
	}
}
