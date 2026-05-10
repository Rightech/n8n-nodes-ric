import type {INodeProperties} from 'n8n-workflow';
import {modelSelector, objectSelector, stdQueryParameters} from "../../common/properties.js";
import {get} from "./get.js";
import {handlerFn} from "../../common/types.js";
import {getMany} from "./getMany.js";
import {update, objectUpdateProperties} from "./update.js";
import {create, objectCreateProperties} from "./create.js";
import {getHistory, objectGetHistoryProperties} from "./getHistory.js";
import {getEvents, objectGetEventsProperties} from "./getEvents.js";
import {sendCommand, objectSendCommandProperties} from "./sendCommand.js";
import {sendTelemetry, objectSendTelemetryProperties} from "./sendTelemetry.js";

export const object: Record<string, handlerFn> = {get, create, update, getMany, getHistory, getEvents, sendCommand, sendTelemetry};

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
                description: 'Creates and configures IoT device connection object. More at https://rightech.io/en/developers/http/objects#create.',
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get object configuration and state',
                description: 'Reads an entire object configuration and recorded state params. More at https://rightech.io/en/developers/http/objects#get-one.',
            },
            {
                name: 'Get Events',
                value: 'getEvents',
                action: 'Get object event log',
                description: 'Get events related to the object. More at https://rightech.io/en/developers/handlers/create#generate-event.',
            },
            {
                name: 'Get History',
                value: 'getHistory',
                action: 'Get object telemetry history',
                // todo: need to publish dedicated topic on telemetry / packets
                description: 'Get historic telemetry packets for a specific time range. More at https://rightech.io/en/developers/terms.',
            },
            {
                name: 'Get Many',
                value: 'getMany',
                action: 'Get multiple objects',
                description: 'Get configuration and state of multiple objects at once. More at https://rightech.io/en/developers/http/objects#get-all.',
            },
            {
                name: 'Send Command',
                value: 'sendCommand',
                action: 'Send command to the object',
                description: 'Sends any assigned command of the object to the device. More at https://rightech.io/en/developers/http/objects#send-command.',
            },
            {
                name: 'Send Telemetry',
                value: 'sendTelemetry',
                action: 'Send telemetry packet to the object',
                description: 'Sends a customizable telemetry packet to the object, simulating device data. More at https://rightech.io/en/developers/models/protocols.',
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update object configuration',
                description: 'Updates object configuration parameters based on its model. More at https://rightech.io/en/developers/http/objects#edit.',
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
    {
        ...modelSelector,
        displayOptions: {
            show: {
                resource: ['object'],
                operation: ['getMany'],
            },
        },
    },
    {
        displayName: 'Model Options',
        name: 'modelOptions',
        type: 'resourceMapper',
        hint: 'Select a model to discover available parameters first.',
        default: {
            mappingMode: 'defineBelow',
            value: null,
        },
        displayOptions: {
            show: {
                resource: ['object'],
                operation: ['getMany'],
            },
            hide: {
                modelId: [''],
            }
        },
        typeOptions: {
            resourceMapper: {
                resourceMapperMethod: "mapObjectColumnsFromModel",
                mode: "add",
                addAllFields: false,
                supportAutoMap: false,
            }
        },
    },
    {
        ...stdQueryParameters,
        displayOptions: {
            show: {
                resource: ['object'],
                operation: ['getMany'],
            },
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
                operation: ['getMany'],
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
    ...objectGetHistoryProperties,
    ...objectCreateProperties,
    ...objectUpdateProperties,
    ...objectGetEventsProperties,
    ...objectSendCommandProperties,
    ...objectSendTelemetryProperties,
];
