import {
	type IDataObject,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeProperties,
	NodeOperationError,
	type ResourceMapperValue,
} from 'n8n-workflow';
import type { INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import { modelSelector, objectSelector } from '../../common/properties.js';
import { httpCall, setNestedValue } from '../../common/util.js';

export const objectUpdateProperties: INodeProperties[] = [
	{
		...objectSelector,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['update'],
			},
		},
	},
	{
		...modelSelector,
		required: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Model Options',
		name: 'modelOptions',
		type: 'resourceMapper',
		hint: 'Select a model to discover available parameters first.',
		default: {
			mappingMode: 'defineBelow',
			value: null,
		},
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['update'],
			},
			hide: {
				modelId: [''],
			},
		},
		typeOptions: {
			resourceMapper: {
				resourceMapperMethod: 'mapObjectColumnsFromModel',
				mode: 'add',
				addAllFields: false,
				supportAutoMap: false,
			},
		},
	},
];

interface UpdateBody {
	id?: string;
	config?: Record<string, unknown>;
	[key: string]: unknown;
}

export async function update(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const objectId = exec.getNodeParameter('objectId', index) as INodeParameterResourceLocator;
	const modelOptions = exec.getNodeParameter('modelOptions', index) as ResourceMapperValue;
	const idPrefix =
		modelOptions.schema.find((f) => f.id === '@idPrefix')?.defaultValue?.toString() ?? '';
	const body: UpdateBody = {};
	if (modelOptions.value) {
		for (const prop in modelOptions.value) {
			setNestedValue(body, prop, modelOptions.value[prop]);
		}
	}
	if (body.id && !body.id.match(/^[a-z0-9\-_:+]+$/)) {
		throw new NodeOperationError(
			exec.getNode(),
			`Specified object ID "${body.id}" contains symbols incompatible with IDs, please use only alphanumeric symbols and ":+_-" symbols.`,
		);
	}
	if (idPrefix && body.id && !body.id.startsWith(idPrefix)) {
		throw new NodeOperationError(
			exec.getNode(),
			`Specified object ID "${body.id}" must start with "${idPrefix}".`,
		);
	}
	const responseData = (await httpCall(exec, {
		method: 'PATCH',
		url: `/api/v1/objects/${objectId.value}`,
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
