import type { INodeProperties } from 'n8n-workflow';
import type { handlerFn } from '../../common/types.js';
import { scenarioStartProperties, start } from './start.js';
import { scenarioStopProperties, stop } from './stop.js';

export const scenario: Record<string, handlerFn> = { start, stop };

export const scenarioApiProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['scenario'],
			},
		},
		options: [
			{
				name: 'Start Scenario',
				value: 'start',
				action: 'Start scenario on an object',
				description: 'Starts a new scenario execution on the object',
			},
			{
				name: 'Stop Scenario',
				value: 'stop',
				action: 'Stop scenario on an object',
				description: 'Stops a running scenario execution on an object',
			},
		],
		default: 'start',
	},
	...scenarioStartProperties,
	...scenarioStopProperties,
];
