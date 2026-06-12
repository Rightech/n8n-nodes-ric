import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import type { INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import { httpCall } from '../../common/util.js';
import { userId } from './parameters.js';

export const userGetProperties: INodeProperties[] = [
	{
		...userId,
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get'],
			},
		},
	},
];

export async function get(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const userId = exec.getNodeParameter('userId', index) as INodeParameterResourceLocator;
	const responseData = (await httpCall(exec, {
		method: 'GET',
		url: `/api/v1/users/${userId.value}`,
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
