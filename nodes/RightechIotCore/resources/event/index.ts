import type { INodeProperties } from 'n8n-workflow';
import type { handlerFn } from '../../common/types.js';
import { eventGetManyProperties, getMany } from './getMany.js';

export const event: Record<string, handlerFn> = { getMany };

export const eventApiProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['event'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get multiple events',
				description: 'Get filtered events from the global event stream',
			},
		],
		default: 'getMany',
	},
	...eventGetManyProperties,
];
