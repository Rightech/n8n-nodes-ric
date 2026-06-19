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
		operation: ['get'],
	},
};

export const getReportBuildApiProperties: INodeProperties[] = [
	{
		...reportBuildId,
		required: true,
		displayOptions,
	},
];

export async function get(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const reportBuildId = exec.getNodeParameter('reportBuildId.value', index) as string;
	const responseData = (await httpCall(exec, {
		method: 'GET',
		url: `/api/v1/reports/builds?where._id=${reportBuildId}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	})) as IDataObject[];
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData[0]), {
			itemData: { item: index },
		}),
	];
}
