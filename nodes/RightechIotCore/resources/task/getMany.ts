import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import type { INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import {
	objectSelector,
	stdQueryParameters,
	type stdQueryParametersType,
} from '../../common/properties.js';
import { httpCall } from '../../common/util.js';
import { assigneeId, kind, priority, status } from './properties.js';

const displayOptions = {
	show: {
		resource: ['task'],
		operation: ['getMany'],
	},
};

export const taskGetManyProperties: INodeProperties[] = [
	{
		...status,
		type: 'multiOptions',
		displayOptions,
	},
	{
		...kind,
		default: [],
		displayName: 'Kind Names or IDs',
		type: 'multiOptions',
		description:
			'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions,
	},
	{
		...priority,
		default: [],
		type: 'multiOptions',
		displayOptions,
	},
	{
		...objectSelector,
		required: false,
		displayOptions,
	},
	{
		...assigneeId,
		displayOptions,
	},
	{
		displayName: 'Optional Parameters',
		name: 'optionalParameters',
		type: 'collection',
		placeholder: 'Add Parameter',
		default: {},
		options: [
			{
				displayName: 'Expired',
				name: 'expired',
				type: 'boolean',
				hint: 'Tasks have reached their deadline',
				default: false,
			},
		],
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
	const stdQueryParameters = exec.getNodeParameter(
		'stdQueryParameters',
		index,
	) as stdQueryParametersType;
	const priority = exec.getNodeParameter('priority', index) as number[];
	const status = exec.getNodeParameter('status', index) as string[];
	const kind = exec.getNodeParameter('kind', index) as string[];
	const assigneeId = exec.getNodeParameter('assigneeId', index) as INodeParameterResourceLocator;
	const objectId = exec.getNodeParameter('objectId', index) as INodeParameterResourceLocator;
	const optionalParameters = exec.getNodeParameter('optionalParameters', index) as {
		expired?: boolean;
	};
	const qs: IDataObject = {
		...stdQueryParameters,
		'where.status': status.length ? status.join(',') : undefined,
		'where.priority': priority.length ? priority.join(',') : undefined,
		'where.kind': kind.length ? kind.join(',') : undefined,
		'where.assignee': assigneeId.value ? assigneeId.value : undefined,
		'where.object': objectId.value ? objectId.value : undefined,
		'where.archived': 'false', // by default users want unarchived tasks
		'where.expired':
			optionalParameters.expired === undefined ? undefined : optionalParameters.expired,
	};
	const request: IHttpRequestOptions = {
		method: 'GET',
		url: `/api/v1/tasks`,
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
