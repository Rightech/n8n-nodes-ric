import type { INodeProperties } from 'n8n-workflow';
import type { handlerFn } from '../../common/types.js';
import { create, userCreateProperties } from './create.js';
import { get, userGetProperties } from './get.js';
import { getMany, userGetManyProperties } from './getMany.js';
import { update, userUpdateProperties } from './update.js';

export const user: Record<string, handlerFn> = { get, getMany, create, update };

export const userApiProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a user',
				description: 'Loads platform user information',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get multiple users',
				description: 'Loads multiple platform users at once',
			},
			{
				name: 'Create a User',
				value: 'create',
				action: 'Create a user',
				description: 'Creates a new platform user',
			},
			{
				name: 'Update a User',
				value: 'update',
				action: 'Update a user',
				description: 'Updates an existing platform user',
			},
		],
		default: 'get',
	},
	...userGetProperties,
	...userGetManyProperties,
	...userCreateProperties,
	...userUpdateProperties,
];
