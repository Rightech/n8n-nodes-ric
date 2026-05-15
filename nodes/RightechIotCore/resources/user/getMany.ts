import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import {
	pagingParameters,
	stdQueryParameters,
	type stdQueryParametersType,
} from '../../common/properties.js';
import { httpCall } from '../../common/util.js';

const displayOptions = {
	show: {
		resource: ['user'],
		operation: ['getMany'],
	},
};

export const userGetManyProperties: INodeProperties[] = [
	{
		displayName: 'Search',
		name: 'search',
		type: 'string',
		hint: 'Search by name or contacts',
		default: '',
		displayOptions,
	},
	{
		...stdQueryParameters,
		options: pagingParameters,
		displayOptions,
	},
];

export async function getMany(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const search = exec.getNodeParameter('search', index) as string;
	const stdQueryParameters = exec.getNodeParameter(
		'stdQueryParameters',
		index,
	) as stdQueryParametersType;
	const qs: IDataObject = {
		search: search ? search : undefined,
		...stdQueryParameters,
	};
	const request: IHttpRequestOptions = {
		method: 'GET',
		url: `/api/v1/users?only=_id,role,group,name,login,email,phone`,
		headers: {
			Accept: 'application/json',
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
