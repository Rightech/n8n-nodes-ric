import {
	type IDataObject,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeProperties,
	NodeOperationError,
	type ResourceMapperValue,
} from 'n8n-workflow';
import type {
	INodeParameterResourceLocator,
	ResourceMapperField,
} from 'n8n-workflow/dist/esm/interfaces.js';
import { objectSelector } from '../../common/properties.js';
import {
	N8N_RESOURCE_MAPPING_MODE_AUTO,
	N8N_RESOURCE_MAPPING_MODE_MANUAL,
	type RicPerObjectModelDeepAndFlat,
	type RicTelemetryDataTypes,
} from '../../common/types.js';
import { httpCall } from '../../common/util.js';

const displayOptions = {
	show: {
		resource: ['object'],
		operation: ['sendTelemetry'],
	},
};

export const objectSendTelemetryProperties: INodeProperties[] = [
	{
		...objectSelector,
		displayOptions,
	},
	{
		displayName: 'Telemetry',
		name: 'telemetry',
		type: 'resourceMapper',
		default: {
			mappingMode: N8N_RESOURCE_MAPPING_MODE_MANUAL,
			value: null,
		},
		displayOptions: {
			...displayOptions,
			hide: {
				objectId: [''],
			},
		},
		typeOptions: {
			minRequiredFields: 1,
			resourceMapper: {
				resourceMapperMethod: 'mapTelemetryParams',
				mode: 'add',
				addAllFields: false,
				supportAutoMap: true,
			},
		},
	},
];

function validateInputType(type: RicTelemetryDataTypes, input: unknown) {
	switch (type) {
		case 'number':
		case 'boolean':
		case 'string':
		case 'object':
			return typeof input === type;
		case 'number[]':
			return Array.isArray(input) && !input.some((i) => typeof i !== 'number');
		case 'boolean[]':
			return Array.isArray(input) && !input.some((i) => typeof i !== 'boolean');
		case 'string[]':
			return Array.isArray(input) && !input.some((i) => typeof i !== 'string');
	}
}

export async function sendTelemetry(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const objectId = exec.getNodeParameter('objectId', index) as INodeParameterResourceLocator;
	const telemetry = exec.getNodeParameter('telemetry', index) as ResourceMapperValue;
	const body: IDataObject = {};
	if (telemetry.mappingMode === N8N_RESOURCE_MAPPING_MODE_AUTO) {
		const input = exec.getInputData()[index].json;
		const modelFlatData = (await httpCall(exec, {
			method: 'GET',
			url: `/api/v1/objects/${objectId.value}/model`,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})) as RicPerObjectModelDeepAndFlat;
		for (const prop of modelFlatData._arguments) {
			if (!prop.active || prop.id === '_ts') {
				continue;
			}
			if (prop.id in input) {
				const value = input[prop.id];
				if (validateInputType(prop.dataType, value)) {
					body[prop.id] = value;
				} else {
					throw new NodeOperationError(
						exec.getNode(),
						`Input data for parameter ${prop.id} did not match the schema - expected ${prop.dataType}, got ${Array.isArray(value) ? 'array' : typeof value}`,
					);
				}
			}
		}
	}
	if (telemetry.mappingMode === N8N_RESOURCE_MAPPING_MODE_MANUAL) {
		const schemaMap: Record<string, ResourceMapperField> = {};
		for (const param of telemetry.schema) {
			schemaMap[param.id] = param;
		}
		if (telemetry.value) {
			for (const param in telemetry.value) {
				switch (schemaMap[param].type) {
					case 'array':
					case 'object':
						body[param] = JSON.parse(telemetry.value[param] as string);
						break;
					default:
						body[param] = telemetry.value[param];
				}
			}
		}
	}
	const responseData = (await httpCall(exec, {
		method: 'POST',
		url: `/api/v1/objects/${objectId.value}/packets`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		json: true,
		body,
	})) as IDataObject;
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
