import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
	ResourceMapperValue,
} from 'n8n-workflow';
import type {
	INodeParameterResourceLocator,
	ResourceMapperField,
} from 'n8n-workflow/dist/esm/interfaces.js';
import {
	modelSelector,
	stdQueryParameters,
	type stdQueryParametersType,
} from '../../common/properties.js';
import { httpCall } from '../../common/util.js';

export const objectGetManyProperties: INodeProperties[] = [
	{
		...modelSelector,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getMany'],
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
				operation: ['getMany'],
			},
		},
		typeOptions: {
			resourceMapper: {
				resourceMapperMethod: 'mapObjectQueryFromModel',
				mode: 'add',
				addAllFields: false,
				supportAutoMap: false,
			},
		},
	},
	{
		...stdQueryParameters,
		options: [
			{
				displayName: 'Device ID',
				name: 'where_id', // todo: underscore notation can be used instead of dot notation in queries, but it is rather circumstantial
				type: 'string',
				default: '',
			},
			{
				displayName: 'Name',
				name: 'where_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Type',
				name: 'where_type',
				type: 'string',
				default: '',
			},
			...(stdQueryParameters.options ?? []),
		],
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Custom Search Parameters',
		name: 'customQueryParameters',
		placeholder: 'Add Parameter',
		hint: 'For expert users. Since object configurations are highly dynamic you may find it simpler to add arbitrary search parameters.',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				name: 'parameters',
				displayName: 'Parameters',
				values: [
					{
						displayName: 'Query',
						name: 'query',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
];

export async function getMany(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const modelId = exec.getNodeParameter('modelId', index) as INodeParameterResourceLocator;
	const stdQueryParameters = exec.getNodeParameter(
		'stdQueryParameters',
		index,
	) as stdQueryParametersType;
	const customQueryParameters = exec.getNodeParameter('customQueryParameters', index) as {
		parameters?: { query: string; value: string }[];
	};
	const modelOptions = exec.getNodeParameter('modelOptions', index) as ResourceMapperValue;
	const qs: IDataObject = {
		'where.model': modelId?.value || undefined,
		...stdQueryParameters,
	};
	if (modelOptions.value) {
		const schemaMap: Record<string, ResourceMapperField> = {};
		for (const param of modelOptions.schema) {
			schemaMap[param.id] = param;
		}
		for (const prop in modelOptions.value) {
			const propValue = modelOptions.value[prop];
			if (schemaMap[prop].type === 'string' && !Number.isNaN(Number(propValue))) {
				qs[`where.${prop}`] = `"${propValue}"`;
			} else {
				qs[`where.${prop}`] = propValue;
			}
		}
	}
	if (customQueryParameters.parameters) {
		for (const parameter of customQueryParameters.parameters) {
			qs[parameter.query] = parameter.value;
		}
	}
	const request: IHttpRequestOptions = {
		method: 'GET',
		url: `/api/v1/objects`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		qs,
	};
	const responseData = (await httpCall(exec, request)) as IDataObject;
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
