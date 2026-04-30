import type {INodeProperties} from 'n8n-workflow';
import {modelSelector, objectSelector} from "../../common/properties.js";
import {get} from "./get.js";
import {sendCommand} from "./sendCommand.js";
import {handlerFn} from "../../common/types.js";
import {getAll} from "./getAll.js";

export const object: Record<string, handlerFn> = {get, getAll, sendCommand};

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
                name: 'Get',
                value: 'get',
                action: 'Get object data and state',
                description: 'Reads an entire object configuration and recorded state params. More at https://rightech.io/en/developers/http/objects#get-one.',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'Get multiple objects',
                description: 'Get configuration and state of multiple objects at once. More at https://rightech.io/en/developers/http/objects#get-all.',
            },
            {
                name: 'Send Command',
                value: 'sendCommand',
                action: 'Send command to the object',
                description: 'Sends any assigned command of the object to the device. More at https://rightech.io/en/developers/http/objects#send-command.',
            },
        ],
        default: 'get',
    },
    {
        ...objectSelector,
        displayOptions: {
            show: {
                resource: ['object'],
                operation: ['get', 'sendCommand'],
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
        displayName: 'Command Options',
        name: 'commandOptions',
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
            },
        ],
    },
    {
        displayName: 'Regular Search Options',
        name: 'searchOptions',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['object'],
                operation: ['getAll'],
            },
        },
        options: [
            modelSelector,
        ],
    },
    {
        displayName: 'Model Search Options',
        name: 'modelSearchOptions',
        type: 'resourceMapper',
        hint: 'Select a model to discover available parameters first.',
        default: {
            mappingMode: 'defineBelow',
            value: null,
        },
        displayOptions: {
            show: {
                resource: ['object'],
                operation: ['getAll'],
            },
        },
        typeOptions: {
            resourceMapper: {
                resourceMapperMethod: "mapObjectQuery",
                mode: "add",
                addAllFields: false,
            }
        },
    },
    {
        displayName: 'Custom Search Parameters',
        name: 'customQueryParameters',
        placeholder: 'Add Parameter',
        hint: 'For expert users. Since object configurations are highly dynamic you may find it simpler to add arbitrary search parameters.',
        type: 'fixedCollection',
        default: {},
        typeOptions: {
            multipleValues: true,
        },
        displayOptions: {
            show: {
                resource: ['object'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                name: 'parameters',
                displayName: 'Parameters',
                values: [
                    {
                        displayName: 'Query',
                        name: 'query',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
    },
];
