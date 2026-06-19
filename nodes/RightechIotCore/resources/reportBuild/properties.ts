import type { INodeProperties } from 'n8n-workflow';
import { ricUuidPropertyMode } from '../../common/properties.js';

export const reportId: INodeProperties = {
	displayName: 'Report',
	name: 'reportId',
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
			placeholder: 'Select a report...',
			typeOptions: {
				searchListMethod: 'listReports',
				searchable: true,
				searchFilterRequired: false,
			},
		},
		ricUuidPropertyMode,
	],
};

export const reportBuildId: INodeProperties = {
	displayName: 'Report Build',
	name: 'reportBuildId',
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
			placeholder: 'Select a build...',
			typeOptions: {
				searchListMethod: 'listReportBuilds',
				searchable: true,
				searchFilterRequired: false,
			},
		},
		ricUuidPropertyMode,
	],
};

export const reportStatus: INodeProperties = {
	displayName: 'Report Status',
	name: 'reportStatus',
	type: 'options',
	default: 'completed',
	options: [
		{ name: 'Cancelled', value: 'cancelled' },
		{ name: 'Completed', value: 'completed' },
		{ name: 'Failed', value: 'failed' },
		{ name: 'Pending', value: 'pending' },
		{ name: 'Processing', value: 'processing' },
		{ name: 'Queued', value: 'queued' },
	],
};
