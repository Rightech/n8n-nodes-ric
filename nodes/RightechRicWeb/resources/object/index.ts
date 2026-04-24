import type { INodeProperties } from 'n8n-workflow';
import {objectSelector} from "../../common/properties.js";

export const objectApiProperties: INodeProperties[] = [
	{
		displayName: 'Options',
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
				name: 'Get',
				value: 'get',
				action: 'Get object data and state',
				description: 'Reads an entire object configuration and recorded state params. More at https://rightech.io/en/developers/http/objects#get-one.',
				routing: {
					request: {
						method: 'GET',
						url: '=/objects/{{$parameter.objectId}}',
					},
				},
			},
			{
				name: 'Send Command',
				value: 'sendCommand',
				action: 'Send command to the object',
				description: 'Sends any existing command of the object to the device. More at https://rightech.io/en/developers/http/objects#send-command.',
				routing: {
					request: {
						method: 'POST',
						url: '=/objects/{{$parameter.objectId}}/commands/{{$parameter.commandId}}',
						body: '={{$parameter.commandAuxiliaryData}}'
					},
				},
			},
		],
		default: 'get',
	},
	{
		...objectSelector,
		displayOptions: {
			show: {
				resource: ['object'],
			},
		},
	},
	{
		displayName: 'Command ID',
		name: 'commandId',
		required: true,
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
				placeholder: 'Select a command...',
				hint: 'Commands are tied to the object model, so you need to select an object first.',
				typeOptions: {
					searchListMethod: 'listCommands',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. led-on',
				hint: 'You can find command IDs in the object model declaration tree in RIC web UI - typically, you would look for a "Commands" folders and then at contained objects.',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[a-z0-9-_]$',
							errorMessage: 'Command ID is an alphanumeric string.',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['sendCommand'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['sendCommand'],
			},
		},
		options: [
			{
				displayName: 'Command Data',
				name: 'commandAuxiliaryData',
				hint: 'Sent data must match with declared parametric fields, the entire object will be sent as is.',
				type: 'json',
				default: {},
				routing: {
					request: {
						body: '={{JSON.parse($value)}}',
						json: true,
					}
				}
			},
		],
	},
];
