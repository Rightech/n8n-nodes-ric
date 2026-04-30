import type {INodeProperties} from 'n8n-workflow';
import {ricUuidPropertyMode} from "../../common/properties.js";
import {get} from "./get.js";
import {handlerFn} from "../../common/types.js";

export const model: Record<string, handlerFn> = {get};

export const modelApiProperties: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['model'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                action: 'Get model configuration',
                description: 'Reads an entire model configuration tree. More at https://rightech.io/en/developers/http/models#get-one.',
            },
        ],
        default: 'get',
    },
    {
        displayName: 'Model ID',
        name: 'modelId',
        required: true,
        type: 'resourceLocator',
        default: {
            mode: 'list',
            value: '',
        },
        displayOptions: {
            show: {
                resource: ['model'],
            },
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
    },
];
