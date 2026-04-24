import type {INodeProperties} from 'n8n-workflow';
import {objectSelector, ricUuidPropertyMode} from "../../common/properties.js";

export const logicApiProperties: INodeProperties[] = [
    {
        displayName: 'Options',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['logic'],
            },
        },
        options: [
            {
                name: 'Start Automation',
                value: 'logicStart',
                action: 'Start automation on an object',
                description: 'Starts a new automation instance on the object. More at https://rightech.io/en/developers/http/logic#execute-start.',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/objects/{{$parameter.objectId}}/automatons/{{$parameter.automatonId}}/start',
                    },
                },
            },
            {
                name: 'Stop Automation',
                value: 'logicStop',
                action: 'Stop automation on an object',
                description: 'Stops a running automaton on an object. More at https://rightech.io/en/developers/http/logic#execute-stop.',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/objects/{{$parameter.objectId}}/automatons/{{$parameter.automatonId}}/stop',
                    },
                },
            },
        ],
        default: 'logicStart',
    },
    {
        ...objectSelector,
        displayOptions: {
            show: {
                resource: ['logic'],
            },
        },
    },
    {
        displayName: 'Logic Automation ID',
        name: 'automatonId',
        required: true,
        type: 'resourceLocator',
        default: {
            mode: 'list',
            value: '',
        },
        displayOptions: {
            show: {
                resource: ['logic'],
            },
        },
        modes: [
            {
                displayName: 'List',
                name: 'list',
                type: 'list',
                placeholder: 'Select an automation...',
                typeOptions: {
                    searchListMethod: 'listAutomatons',
                    searchable: true,
                    searchFilterRequired: false,
                },
            },
            ricUuidPropertyMode,
        ],
    },
];
