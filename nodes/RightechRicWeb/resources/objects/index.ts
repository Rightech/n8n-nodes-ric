import type { INodeProperties } from 'n8n-workflow';
import {objectSelector} from "../../common/properties.js";

export const objectsApiProperties: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['objects'],
			},
		},
		options: [
			{
				name: 'Get Object',
				value: 'readObject',
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
				value: 'sendObjectCommand',
				action: 'Send command to the object',
				description: 'Sends any existing command of the object to the object. More at https://rightech.io/en/developers/http/objects#send-command.',
				routing: {
					request: {
						method: 'POST',
						url: '=/objects/{{$parameter.objectId}}/commands/{{$parameter.commandId}}',
						body: '={{$parameter.commandAuxiliaryData}}'
					},
				},
			},
		],
		default: 'readObject',
	},
	{
		...objectSelector,
		displayOptions: {
			show: {
				resource: ['objects'],
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
				displayName: 'List',
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
				displayName: 'ID',
				name: 'id',
				type: 'string',
				hint: 'Enter an ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[a-z0-9-_]$',
							errorMessage: 'Command ID is an alphanumeric string.',
						},
					},
				],
				placeholder: 'e.g. `led-on`',
			},
		],
		displayOptions: {
			show: {
				resource: ['objects'],
				operation: ['sendObjectCommand'],
			},
		},
	},
	{
		displayName: 'Send Extra Command Data',
		name: 'commandUseAuxiliaryData',
		hint: 'Does anything only for commands with parametric fields.',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['objects'],
				operation: ['sendObjectCommand'],
			},
		}
	},
	{
		displayName: 'Extra Command Data',
		name: 'commandAuxiliaryData',
		hint: 'Sent data must match with declared parametric fields, the entire object will be sent as is.',
		type: 'json',
		default: {},
		displayOptions: {
			show: {
				resource: ['objects'],
				operation: ['sendObjectCommand'],
				commandUseAuxiliaryData: [true],
			},
		},
		routing: {
			request: {
				body: '={{JSON.parse($value)}}',
				json: true,
			}
		}
	},
];
