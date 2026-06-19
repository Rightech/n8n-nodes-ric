import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { stdQueryParameters, type stdQueryParametersType } from '../../common/properties.js';
import { httpCall } from '../../common/util.js';
import { userId } from '../user/parameters.js';
import { reportId, reportStatus } from './properties.js';

const displayOptions = {
	show: {
		resource: ['reportBuild'],
		operation: ['getMany'],
	},
};

export const getManyReportBuildApiProperties: INodeProperties[] = [
	{
		...reportId,
		displayOptions,
	},
	{
		...userId,
		displayName: 'Owner',
		name: 'ownerId',
		displayOptions,
	},
	{
		...reportStatus,
		type: 'multiOptions',
		default: [],
		displayOptions,
	},
	{
		...stdQueryParameters,
		displayOptions,
	},
];

export async function getMany(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const reportId = exec.getNodeParameter('reportId.value', index) as string;
	const ownerId = exec.getNodeParameter('ownerId.value', index) as string;
	const reportStatus = exec.getNodeParameter('reportStatus', index) as string[];
	const stdQueryParameters = exec.getNodeParameter(
		'stdQueryParameters',
		index,
	) as stdQueryParametersType;
	const responseData = (await httpCall(exec, {
		method: 'GET',
		url: `/api/v1/reports/builds`,
		headers: {
			Accept: 'application/json',
		},
		qs: {
			'where.report': reportId || undefined,
			'where.owner': ownerId || undefined,
			'where.status': reportStatus.length ? reportStatus.join(',') : undefined,
			...stdQueryParameters,
		},
	})) as IDataObject;
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
