import type { INodeProperties } from 'n8n-workflow';
import type { handlerFn } from '../../common/types.js';
import { get, modelGetProperties } from './get.js';

export const model: Record<string, handlerFn> = { get };

export const modelApiProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['model'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get model configuration',
				description: 'Reads an entire model configuration tree',
			},
		],
		default: 'get',
	},
	...modelGetProperties,
];
