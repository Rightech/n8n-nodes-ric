import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import type { INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import { modelSelector } from '../../common/properties.js';
import { httpCall } from '../../common/util.js';

export const modelGetProperties: INodeProperties[] = [
	{
		...modelSelector,
		required: true,
		displayOptions: {
			show: {
				resource: ['model'],
				operation: ['get'],
			},
		},
	},
];

export async function get(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const modelId = exec.getNodeParameter('modelId', index) as INodeParameterResourceLocator;
	const responseData = (await httpCall(exec, {
		method: 'GET',
		url: `/api/v1/models/${modelId.value}`,
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
