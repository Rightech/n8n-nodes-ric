import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { httpCall } from '../../common/util.js';
import { reportBuildId } from './properties.js';

const displayOptions = {
	show: {
		resource: ['reportBuild'],
		operation: ['cancel'],
	},
};

export const cancelReportBuildApiProperties: INodeProperties[] = [
	{
		...reportBuildId,
		required: true,
		displayOptions,
	},
];

export async function cancel(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const reportBuildId = exec.getNodeParameter('reportBuildId.value', index) as string;
	const responseData = (await httpCall(exec, {
		method: 'POST',
		url: `/api/v1/reports/builds/${reportBuildId}/cancel`,
		headers: {
			Accept: 'application/json',
		},
	})) as IDataObject;
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
