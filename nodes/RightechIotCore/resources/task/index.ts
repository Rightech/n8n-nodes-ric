import type { INodeProperties } from 'n8n-workflow';
import type { handlerFn } from '../../common/types.js';
import { get, taskGetProperties } from './get.js';
import { getMany, taskGetManyProperties } from './getMany.js';

export const task: Record<string, handlerFn> = { get, getMany };

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
		],
		default: 'get',
	},
	...taskGetProperties,
	...taskGetManyProperties,
];
