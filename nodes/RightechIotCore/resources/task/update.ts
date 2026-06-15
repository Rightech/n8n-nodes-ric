import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import type { INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import { httpCall } from '../../common/util.js';
import { assigneeId, deadline, priority, taskId } from './properties.js';

const displayOptions = {
	show: {
		resource: ['task'],
		operation: ['update'],
	},
};

export const taskUpdateProperties: INodeProperties[] = [
	{
		...taskId,
		required: true,
		displayOptions,
	},
	{
		displayName: 'Fields to Set',
		name: 'fields',
		type: 'collection',
		displayOptions,
		default: {},
		options: [
			{
				...priority,
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				typeOptions: {
					rows: 3,
				},
			},
			{
				...assigneeId,
			},
			{
				...deadline,
			},
		],
	},
];

export async function update(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const taskId = exec.getNodeParameter('taskId.value', index) as string;
	const fields = exec.getNodeParameter('fields', index) as {
		priority?: number;
		name?: string;
		description?: string;
		assigneeId?: INodeParameterResourceLocator;
		deadline?: string;
	};
	const body: { [key: string]: unknown } = {
		...fields,
		name: fields.name || undefined,
		assigneeId: undefined,
		deadline: undefined,
		assignee: fields.assigneeId?.value,
		deadlines: fields.deadline ? { inwork: new Date(fields.deadline).getTime() } : { inwork: null },
	};
	const responseData = (await httpCall(exec, {
		method: 'PATCH',
		url: `/api/v1/tasks/${taskId}`,
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
