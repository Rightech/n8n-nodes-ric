import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { objectSelector } from '../../common/properties.js';
import { httpCall } from '../../common/util.js';
import { assigneeId, deadline, kind, priority } from './properties.js';

const displayOptions = {
	show: {
		resource: ['task'],
		operation: ['create'],
	},
};

export const taskCreateProperties: INodeProperties[] = [
	{
		...kind,
		required: true,
		displayOptions,
	},
	{
		...priority,
		default: 3,
		required: true,
		displayOptions,
	},
	{
		...objectSelector,
		hint: 'For some kinds of tasks, only one active task can exist per object',
		required: true,
		displayOptions,
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions,
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		typeOptions: {
			rows: 3,
		},
		displayOptions,
	},
	{
		...assigneeId,
		displayOptions,
	},
	{
		...deadline,
		displayOptions,
	},
];

export async function create(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const kind = exec.getNodeParameter('kind', index) as string;
	const priority = exec.getNodeParameter('priority', index) as string;
	const name = exec.getNodeParameter('name', index) as string;
	const description = exec.getNodeParameter('description', index) as string;
	const objectId = exec.getNodeParameter('objectId.value', index) as string;
	const assigneeId = exec.getNodeParameter('assigneeId.value', index) as string;
	const deadline = exec.getNodeParameter('deadline', index) as string;
	const body: { [key: string]: unknown } = {
		status: assigneeId ? 'assigned' : 'created',
		kind,
		priority,
		name,
		description,
		object: objectId,
		assignee: assigneeId || undefined,
		deadlines: deadline ? { inwork: new Date(deadline).getTime() } : undefined,
	};
	const responseData = (await httpCall(exec, {
		method: 'POST',
		url: `/api/v1/tasks`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		json: true,
		body,
	})) as IDataObject;
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
