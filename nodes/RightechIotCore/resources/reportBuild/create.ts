import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { httpCall } from '../../common/util.js';
import { reportId } from './properties.js';

const displayOptions = {
	show: {
		resource: ['reportBuild'],
		operation: ['create'],
	},
};

export const createReportBuildApiProperties: INodeProperties[] = [
	{
		displayName: `
		Please note that the system has a hard limit of no more than 10 built reports.
		As soon as another report is built, the oldest build over the limit is permanently deleted.
		This includes automated report building jobs.
		`,
		name: 'reportLimitNotice',
		type: 'callout',
		default: '',
		displayOptions,
	},
	{
		...reportId,
		required: true,
		displayOptions,
	},
	{
		displayName: 'Period From',
		name: 'periodFrom',
		required: true,
		default: '',
		type: 'dateTime',
		displayOptions,
	},
	{
		displayName: 'Period To',
		name: 'periodTo',
		required: true,
		default: '',
		type: 'dateTime',
		displayOptions,
	},
	{
		displayName: 'Object Names or IDs',
		name: 'objectIds',
		type: 'multiOptions',
		description:
			'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		default: [],
		required: true,
		typeOptions: {
			loadOptionsMethod: 'loadOptionsObjects',
		},
		displayOptions,
	},
];

export async function create(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const reportId = exec.getNodeParameter('reportId.value', index) as string;
	const periodFrom = exec.getNodeParameter('periodFrom', index) as string;
	const periodTo = exec.getNodeParameter('periodTo', index) as string;
	const objectIds = exec.getNodeParameter('objectIds', index) as string[];
	const responseData = (await httpCall(exec, {
		method: 'POST',
		url: `/api/v1/reports/${reportId}/build`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: {
			period: {
				from: new Date(periodFrom).getTime(),
				to: new Date(periodTo).getTime(),
			},
			objectIds: objectIds,
		},
	})) as IDataObject;
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
