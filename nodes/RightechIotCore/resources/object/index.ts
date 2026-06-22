import type { INodeProperties } from 'n8n-workflow';
import { objectSelector } from '../../common/properties.js';
import type { handlerFn } from '../../common/types.js';
import { create, objectCreateProperties } from './create.js';
import { get } from './get.js';
import { getEvents, objectGetEventsProperties } from './getEvents.js';
import { getHistory, objectGetHistoryProperties } from './getHistory.js';
import { getMany, objectGetManyProperties } from './getMany.js';
import { objectSendCommandProperties, sendCommand } from './sendCommand.js';
import { objectSendTelemetryProperties, sendTelemetry } from './sendTelemetry.js';
import { objectUpdateProperties, update } from './update.js';

export const object: Record<string, handlerFn> = {
	get,
	create,
	update,
	getMany,
	getHistory,
	getEvents,
	sendCommand,
	sendTelemetry,
};

export const objectApiProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['object'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create object configuration',
				description: 'Creates and configures IoT device connection object',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get object configuration and state',
				description: 'Reads an entire object configuration and recorded state params',
			},
			{
				name: 'Get Events',
				value: 'getEvents',
				action: 'Get object event log',
				description: 'Get events related to the object',
			},
			{
				name: 'Get History',
				value: 'getHistory',
				action: 'Get object telemetry history',
				// todo: need to publish dedicated topic on telemetry / packets
				description: 'Get historic telemetry packets for a specific time range',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get multiple objects',
				description: 'Get configuration and state of multiple objects at once',
			},
			{
				name: 'Send Command',
				value: 'sendCommand',
				action: 'Send command to the object',
				description: 'Sends any assigned command of the object to the device',
			},
			{
				name: 'Send Telemetry',
				value: 'sendTelemetry',
				action: 'Send telemetry packet to the object',
				description: 'Sends a customizable telemetry packet to the object, simulating device data',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update object configuration',
				description: 'Updates object configuration parameters based on its model',
			},
		],
		default: 'get',
	},
	{
		...objectSelector,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['get'],
			},
		},
	},
	...objectGetManyProperties,
	...objectGetHistoryProperties,
	...objectCreateProperties,
	...objectUpdateProperties,
	...objectGetEventsProperties,
	...objectSendCommandProperties,
	...objectSendTelemetryProperties,
];
