import {
	type IDataObject,
	type IExecuteFunctions,
	type IHttpRequestOptions,
	type INodeExecutionData,
	type INodeProperties,
	WorkflowConfigurationError,
} from 'n8n-workflow';
import type {
	INodeParameterResourceLocator,
	NodeParameterValue,
} from 'n8n-workflow/dist/esm/interfaces.js';
import { objectSelector, pagingParameters, stdQueryParameters } from '../../common/properties.js';
import { httpCall } from '../../common/util.js';

export interface historyQueryParameters {
	limit?: number;
	offset?: number;
}

export const objectGetHistoryProperties: INodeProperties[] = [
	{
		...objectSelector,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getHistory'],
			},
		},
	},
	{
		displayName:
			'IoT devices can amass a lot of telemetry, so to keep your workflows efficient try to limit selected ranges to the most narrow you can use.',
		name: 'getHistoryEfficiencyNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getHistory'],
			},
		},
	},
	{
		displayName: 'From',
		name: 'getHistoryFrom',
		required: true,
		type: 'dateTime',
		default: '',
		hint: 'Typically, telemetry data is stored for up to three months - depending on your configuration',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getHistory'],
			},
		},
	},
	{
		displayName: 'To',
		name: 'getHistoryTo',
		type: 'dateTime',
		default: '',
		hint: 'Up to a month of data can be returned at a time and by default.',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getHistory'],
			},
		},
	},
	{
		...stdQueryParameters,
		name: 'historyQueryParameters',
		options: pagingParameters,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getHistory'],
			},
		},
	},
];

export async function getHistory(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const objectId = exec.getNodeParameter('objectId', index) as INodeParameterResourceLocator;
	const getHistoryFrom = exec.getNodeParameter('getHistoryFrom', index) as string; // note: required field
	const getHistoryTo = exec.getNodeParameter('getHistoryTo', index) as NodeParameterValue;
	const historyQueryParameters = exec.getNodeParameter(
		'historyQueryParameters',
		index,
	) as historyQueryParameters;
	if (getHistoryTo && getHistoryTo < getHistoryFrom) {
		throw new WorkflowConfigurationError(
			exec.getNode(),
			`Lookup time range ${getHistoryFrom}-${getHistoryTo} is inverted - no data can be found.`,
		);
	}
	const qs: IDataObject = {
		from: getHistoryFrom,
		to: getHistoryTo ? getHistoryTo : undefined,
		...historyQueryParameters,
	};
	const request: IHttpRequestOptions = {
		method: 'GET',
		url: `/api/v1/objects/${objectId.value}/packets`,
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
