import type { INodeProperties, INodePropertyMode } from 'n8n-workflow';
import type {
	INodePropertyCollection,
	INodePropertyOptions,
} from 'n8n-workflow/dist/esm/interfaces.js';

// because INodePropertyMode does not have defaults
// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
export const ricUuidPropertyMode: INodePropertyMode = {
	displayName: 'By ID',
	name: 'id',
	type: 'string',
	placeholder: 'e.g. 5951113beb39561100fd5bbb',
	hint: 'Automatically assigned by RIC - you can find it using e.g. <a href="https://rightech.io/en/developers/intro">Copy RIC ID</a> feature.',
	validation: [
		{
			type: 'regex',
			properties: {
				regex: '^([a-z0-9]{24})?$',
				errorMessage: 'ID must be 24 alphanumeric symbols.',
			},
		},
	],
};

export const objectSelector: INodeProperties = {
	displayName: 'Object',
	name: 'objectId',
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
			placeholder: 'Select an object...',
			typeOptions: {
				searchListMethod: 'listObjects',
				searchable: true,
				searchFilterRequired: false,
			},
		},
		{
			displayName: 'By Device ID',
			name: 'deviceId',
			type: 'string',
			placeholder: 'e.g. wialon:1234567878 or mqtt-project_name-aqv0zb',
			hint: 'It is set during <a href="https://rightech.io/en/developers/objects/create">device connection</a>',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '^[a-z0-9:_+\\-]*$',
						errorMessage: 'May only contain latin letters, numbers and symbols ":", "-", "+", "_".',
					},
				},
			],
		},
		ricUuidPropertyMode,
	],
};

export const modelSelector: INodeProperties = {
	displayName: 'Model',
	name: 'modelId',
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
			placeholder: 'Select a model...',
			typeOptions: {
				searchListMethod: 'listModels',
				searchable: true,
				searchFilterRequired: false,
			},
		},
		ricUuidPropertyMode,
	],
};

export const tableSelector: INodeProperties = {
	displayName: 'Table ID',
	name: 'tableId',
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
			placeholder: 'Select a table...',
			typeOptions: {
				searchListMethod: 'listTables',
				searchable: true,
				searchFilterRequired: false,
			},
		},
		ricUuidPropertyMode,
	],
};

export interface stdQueryParametersType {
	from?: string;
	to?: string;
	limit?: number;
	offset?: number;
}

export const pagingParameters: Array<
	INodePropertyOptions | INodeProperties | INodePropertyCollection
> = [
	{
		displayName: 'Result Limit',
		name: 'limit',
		description: 'Max number of results to return',
		hint: 'Max number of results to return',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 10000,
		},
		default: 50,
	},
	{
		displayName: 'Lookup Offset',
		name: 'offset',
		hint: 'Specify an offset parameter to get more data',
		type: 'number',
		default: '',
	},
];

export const stdQueryParameters: INodeProperties = {
	displayName: 'Standard Search Parameters',
	name: 'stdQueryParameters',
	type: 'collection',
	placeholder: 'Add Parameter',
	hint: 'Standard parameters for most <a href="https://rightech.io/en/developers/http/base#get-all">searches</a>.',
	default: {},
	options: [
		{
			displayName: 'Created After',
			name: 'from', // ISO 8601, Unix time
			hint: 'Select only items created after this time',
			type: 'dateTime',
			default: '',
		},
		{
			displayName: 'Created Before',
			name: 'to',
			hint: 'Select only items created before this time',
			type: 'dateTime',
			default: '',
		},
		...pagingParameters,
	],
};
