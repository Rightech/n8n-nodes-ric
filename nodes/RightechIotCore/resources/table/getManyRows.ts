import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	ResourceMapperValue,
} from 'n8n-workflow';
import type { INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import {
	stdQueryParameters,
	type stdQueryParametersType,
	tableSelector,
} from '../../common/properties.js';
import { httpCall } from '../../common/util.js';

const displayOptions = {
	show: {
		resource: ['table'],
		operation: ['getManyRows'],
	},
};

export const tableGetManyProperties: INodeProperties[] = [
	{
		...tableSelector,
		displayOptions,
	},
	{
		displayName: 'Search Columns',
		name: 'tableQueryColumns',
		type: 'resourceMapper',
		default: {
			mappingMode: 'defineBelow',
			value: null,
		},
		displayOptions,
		typeOptions: {
			resourceMapper: {
				resourceMapperMethod: 'mapTableRowQuery',
				mode: 'add',
				addAllFields: false,
				supportAutoMap: false,
			},
		},
	},
	{
		...stdQueryParameters,
		displayOptions,
	},
];

export async function getManyRows(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const tableId = exec.getNodeParameter('tableId', index) as INodeParameterResourceLocator;
	const stdQueryParameters = exec.getNodeParameter(
		'stdQueryParameters',
		index,
	) as stdQueryParametersType;
	const tableQueryColumns = exec.getNodeParameter(
		'tableQueryColumns',
		index,
	) as ResourceMapperValue;
	const responseData = (await httpCall(exec, {
		method: 'GET',
		url: `/api/v1/tables/${tableId.value}/rows`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		qs: {
			...stdQueryParameters,
			...tableQueryColumns.value,
		},
	})) as IDataObject;
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
