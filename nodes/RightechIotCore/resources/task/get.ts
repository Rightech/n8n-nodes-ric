import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import type { INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import { ricUuidPropertyMode } from '../../common/properties.js';
import { httpCall } from '../../common/util.js';

export const taskGetProperties: INodeProperties[] = [
	{
		displayName: 'Task',
		name: 'taskId',
		required: true,
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
				placeholder: 'Select a task...',
				typeOptions: {
					searchListMethod: 'listTasks',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			ricUuidPropertyMode,
		],
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['get'],
			},
		},
	},
];

export async function get(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const taskId = exec.getNodeParameter('taskId', index) as INodeParameterResourceLocator;
	const responseData = (await httpCall(exec, {
		method: 'GET',
		url: `/api/v1/tasks/${taskId.value}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	})) as IDataObject;
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
