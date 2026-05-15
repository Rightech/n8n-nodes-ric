import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { objectSelector } from '../../common/properties.js';
import type { RicEventShell } from '../../common/types.js';
import { httpCall } from '../../common/util.js';

const displayOptions = {
	show: {
		resource: ['object'],
		operation: ['getEvents'],
	},
};

export const objectGetEventsProperties: INodeProperties[] = [
	{
		...objectSelector,
		displayOptions,
	},
	{
		displayName:
			'System can amass a lot of events, so to keep your workflows efficient - try to filter them to the only ones you need.',
		name: 'getEventsEfficiencyNotice',
		type: 'notice',
		default: '',
		displayOptions,
	},
	{
		displayName: 'From',
		name: 'from',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions,
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'dateTime',
		required: true,
		hint: 'Only up to a month of data can be returned at a time and by default.',
		default: '',
		displayOptions,
	},
	{
		displayName: 'Only Include Event Types',
		name: 'include',
		description:
			'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		type: 'multiOptions',
		hint: 'All events are included by default unless specified',
		default: [],
		typeOptions: {
			loadOptionsMethod: 'eventOptionsOfObjects',
		},
		displayOptions,
	},
	{
		displayName: 'Exclude Event Types',
		name: 'exclude',
		description:
			'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		type: 'multiOptions',
		default: [],
		typeOptions: {
			loadOptionsMethod: 'eventOptionsOfObjects',
		},
		displayOptions,
	},
];

export async function getEvents(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const objectId = exec.getNodeParameter('objectId.value', index) as string;
	const from = exec.getNodeParameter('from', index) as string | undefined;
	const to = exec.getNodeParameter('to', index) as string | undefined;
	const include = exec.getNodeParameter('include', index) as string[];
	const exclude = exec.getNodeParameter('exclude', index) as string[];
	const qs: IDataObject = {
		from: from ? new Date(from).getTime() : undefined,
		to: to ? new Date(to).getTime() : undefined,
		// todo: add event types to object event api?
	};
	const request: IHttpRequestOptions = {
		method: 'GET',
		url: `/api/v1/objects/${objectId}/events`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		qs,
	};
	let responseData = (await httpCall(exec, request)) as RicEventShell[];
	if (include.length) {
		responseData = responseData.filter((e) => include.includes(e.event));
	}
	if (exclude.length) {
		responseData = responseData.filter((e) => !exclude.includes(e.event));
	}
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
