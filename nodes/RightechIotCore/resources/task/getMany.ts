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
	ricUuidPropertyMode,
	stdQueryParameters,
	type stdQueryParametersType,
} from '../../common/properties.js';
import { httpCall } from '../../common/util.js';

const displayOptions = {
	show: {
		resource: ['task'],
		operation: ['getMany'],
	},
};

export const taskGetManyProperties: INodeProperties[] = [
	{
		displayName: 'Status',
		name: 'status',
		type: 'multiOptions',
		hint: 'Search by current status',
		default: [],
		options: [
			{
				name: 'Open',
				value: 'created',
			},
			{
				name: 'Assigned',
				value: 'assigned',
			},
			{
				name: 'In Work',
				value: 'inwork',
			},
			{
				name: 'Completed',
				value: 'closed',
			},
		],
		displayOptions,
	},
	{
		displayName: 'Task Kind Types',
		name: 'kind',
		type: 'multiOptions',
		description:
			'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		hint: 'Search by task kinds',
		default: [],
		typeOptions: {
			loadOptionsMethod: 'loadOptionsOfTaskKinds',
		},
		displayOptions,
	},
	{
		...objectSelector,
		required: false,
		displayOptions,
	},
	{
		displayName: 'Assignee',
		name: 'assigneeId',
		type: 'resourceLocator',
		default: {
			mode: 'list',
			value: '',
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a user...',
				typeOptions: {
					searchListMethod: 'listUsers',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			ricUuidPropertyMode,
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
	const status = exec.getNodeParameter('status', index) as string[];
	const kind = exec.getNodeParameter('kind', index) as string[];
	const assigneeId = exec.getNodeParameter('assigneeId', index) as INodeParameterResourceLocator;
	const objectId = exec.getNodeParameter('objectId', index) as INodeParameterResourceLocator;
	const qs: IDataObject = {
		...stdQueryParameters,
		'where.status': status.length ? status.join(',') : undefined,
		'where.kind': kind.length ? kind.join(',') : undefined,
		'where.assignee': assigneeId.value ? assigneeId.value : undefined,
		'where.object': objectId.value ? objectId.value : undefined,
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
