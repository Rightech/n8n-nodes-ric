import type { INodeProperties } from 'n8n-workflow';

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
				name: 'Read object',
				value: 'readObject',
				action: 'Read object data and state',
				description: 'https://rightech.io/en/developers/http/objects#get-one',
				routing: {
					request: {
						method: 'GET',
						url: '=/objects/{{$parameter.objectId}}',
					},
				},
			},
			{
				name: 'Read telemetry',
				value: 'readObject',
				action: 'Read object telemetry packets history',
				description: 'https://rightech.io/en/developers/http/objects#history',
				routing: {
					request: {
						method: 'GET',
						url: '=/objects/{{$parameter.objectId}}/packets',
					},
				},
			},
			{
				name: 'Send command',
				value: 'sendObjectCommand',
				action: 'Send command to the object',
				description: 'https://rightech.io/en/developers/http/objects#send-command',
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
		name: 'objectId',
		displayName: 'Object ID',
		required: true,
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['objects'],
			},
		},
	},
	{
		name: 'commandId',
		displayName: 'Command ID',
		required: true,
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['objects'],
				operation: ['sendObjectCommand'],
			},
		},
	},
	{
		name: 'commandUseAuxiliaryData',
		displayName: 'Send extra command data',
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
		name: 'commandAuxiliaryData',
		displayName: 'Extra command data',
		hint: 'Sent data must match with declared parametric fields, the entire object will be sent as is.',
		required: false,
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
