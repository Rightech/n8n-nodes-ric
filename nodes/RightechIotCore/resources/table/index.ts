import type { INodeProperties } from 'n8n-workflow';
import type { handlerFn } from '../../common/types.js';
import { get, tableGetProperties } from './get.js';
import { getManyRows, tableGetManyProperties } from './getManyRows.js';
import { getRow, tableGetRowProperties } from './getRow.js';

export const table: Record<string, handlerFn> = { get, getRow, getManyRows };

export const tableApiProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['table'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get data table declaration',
				description:
					'Returns table declaration with column properties.',
			},
			{
				name: 'Get Row',
				value: 'getRow',
				action: 'Get table row',
				description:
					'Returns a specific table row',
			},
			{
				name: 'Get Rows',
				value: 'getManyRows',
				action: 'Get table rows',
				description:
					'Returns table rows, optionally matching selected conditions',
			},
		],
		default: 'get',
	},
	...tableGetProperties,
	...tableGetManyProperties,
	...tableGetRowProperties,
];
