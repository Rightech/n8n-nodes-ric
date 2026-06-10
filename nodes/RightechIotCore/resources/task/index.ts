import type { INodeProperties } from 'n8n-workflow';
import type { handlerFn } from '../../common/types.js';
import { create, taskCreateProperties } from './create.js';
import { get, taskGetProperties } from './get.js';
import { getMany, taskGetManyProperties } from './getMany.js';
import { taskUpdateProperties, update } from './update.js';

export const task: Record<string, handlerFn> = { get, getMany, create, update };

export const taskApiProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a task',
				description: 'Loads task information',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get multiple tasks',
				description: 'Loads multiple tasks at once',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a task',
				description: 'Creates a new task',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a task',
				description: 'Updates task parameters',
			},
		],
		default: 'get',
	},
	...taskGetProperties,
	...taskGetManyProperties,
	...taskCreateProperties,
	...taskUpdateProperties,
];
