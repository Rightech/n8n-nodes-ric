import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import type { INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import { ricUuidPropertyMode, tableSelector } from '../../common/properties.js';
import { httpCall } from '../../common/util.js';

const displayOptions = {
	show: {
		resource: ['table'],
		operation: ['getRow'],
	},
};

export const tableGetRowProperties: INodeProperties[] = [
	{
		...tableSelector,
		displayOptions,
	},
	{
		displayName: 'Table Row ID',
		name: 'tableRowId',
		required: true,
		type: 'resourceLocator',
		default: {
			mode: 'list',
			value: '',
		},
		displayOptions,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a row...',
				typeOptions: {
					searchListMethod: 'listRows',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			ricUuidPropertyMode,
		],
	},
];

export async function getRow(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const tableId = exec.getNodeParameter('tableId', index) as INodeParameterResourceLocator;
	const tableRowId = exec.getNodeParameter('tableRowId', index) as INodeParameterResourceLocator;
	const responseData = (await httpCall(exec, {
		method: 'GET',
		url: `/api/v1/tables/${tableId.value}/rows/${tableRowId.value}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	})) as IDataObject;
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
