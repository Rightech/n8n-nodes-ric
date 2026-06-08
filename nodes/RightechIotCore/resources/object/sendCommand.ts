import type {
	GenericValue,
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import type { INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import { objectSelector } from '../../common/properties.js';
import { httpCall } from '../../common/util.js';

const displayOptions = {
	show: {
		resource: ['object'],
		operation: ['sendCommand'],
	},
};

export const objectSendCommandProperties: INodeProperties[] = [
	{
		...objectSelector,
		displayOptions,
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
							regex: '^[a-z0-9-_]+$',
							errorMessage: 'Command ID is an alphanumeric string.',
						},
					},
				],
			},
		],
		displayOptions,
	},
	{
		displayName: 'Command Options',
		name: 'commandOptions',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions,
		options: [
			{
				displayName: 'Command Data',
				name: 'commandAuxiliaryData',
				hint: 'Sent data must match with declared parametric fields, the entire object will be sent as is.',
				type: 'json',
				default: {},
			},
		],
	},
];

export async function sendCommand(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const objectId = exec.getNodeParameter('objectId', index) as INodeParameterResourceLocator;
	const commandId = exec.getNodeParameter('commandId', index) as INodeParameterResourceLocator;
	const commandOptions = exec.getNodeParameter('commandOptions', index) as {
		commandAuxiliaryData?: GenericValue; // todo: technically, commands have schemas, but they can be pretty complicated to parse
	};
	const responseData = (await httpCall(exec, {
		method: 'POST',
		url: `/api/v1/objects/${objectId.value}/commands/${commandId.value}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		json: commandOptions.commandAuxiliaryData !== undefined,
		body: commandOptions.commandAuxiliaryData,
	})) as IDataObject;
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
