import type {INodeProperties} from 'n8n-workflow';
import {objectSelector, ricUuidPropertyMode} from "../../common/properties.js";
import {start} from "./start.js";
import {stop} from "./stop.js";
import {handlerFn} from "../../common/types.js";

export const scenario: Record<string, handlerFn> = {start, stop};

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
                description: 'Starts a new scenario execution on the object. More at https://rightech.io/en/developers/http/logic#execute-start.',
            },
            {
                name: 'Stop Scenario',
                value: 'stop',
                action: 'Stop scenario on an object',
                description: 'Stops a running scenario execution on an object. More at https://rightech.io/en/developers/http/logic#execute-stop.',
            },
        ],
        default: 'start',
    },
    {
        ...objectSelector,
        displayOptions: {
            show: {
                resource: ['scenario'],
            },
        },
    },
    {
        displayName: 'Scenario ID',
        name: 'scenarioId',
        required: true,
        type: 'resourceLocator',
        default: {
            mode: 'list',
            value: '',
        },
        displayOptions: {
            show: {
                resource: ['scenario'],
            },
        },
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                placeholder: 'Select a scenario...',
                typeOptions: {
                    searchListMethod: 'listScenarios',
                    searchable: true,
                    searchFilterRequired: false,
                },
            },
            ricUuidPropertyMode,
        ],
    },
];
