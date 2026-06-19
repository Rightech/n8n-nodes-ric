import type { INodeProperties } from 'n8n-workflow';
import type { handlerFn } from '../../common/types.js';
import { _export, exportReportBuildApiProperties } from './_export.js';
import { cancel, cancelReportBuildApiProperties } from './cancel.js';
import { create, createReportBuildApiProperties } from './create.js';
import { get, getReportBuildApiProperties } from './get.js';
import { getMany, getManyReportBuildApiProperties } from './getMany.js';

export const reportBuild: Record<string, handlerFn> = { get, getMany, create, cancel, _export };

export const reportBuildApiProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['reportBuild'],
			},
		},
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				action: 'Cancel a report build',
				description:
					'Sometimes you may realize that your report build order was too large or simply a mistake',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a new report build',
				description:
					'You can order to build a previously designed report, which takes some time to prepare data for you',
			},
			{
				name: 'Export',
				value: '_export',
				action: 'Export a report build',
				description:
					'When report is ready you can export the built data in various formats, like tables or JSON',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a report build',
				description: 'Loads report build status',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get multiple report builds',
				description: 'Loads multiple builds at once',
			},
		],
		default: 'get',
	},
	...getReportBuildApiProperties,
	...getManyReportBuildApiProperties,
	...createReportBuildApiProperties,
	...cancelReportBuildApiProperties,
	...exportReportBuildApiProperties,
];
