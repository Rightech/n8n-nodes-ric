import type {INodeProperties} from 'n8n-workflow';
import {ricUuidPropertyMode, stdQueryParameters} from "../../common/properties.js";
import {get} from "./get.js";
import {getRow} from "./getRow.js";
import {getManyRows} from "./getManyRows.js";
import {handlerFn} from "../../common/types.js";

export const table: Record<string, handlerFn> = {get, getRow, getManyRows};

export const tableApiProperties: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['table'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                action: 'Get data table declaration',
                description: 'Returns table declaration with column properties. More at https://rightech.io/en/developers/objects/table.',
            },
            {
                name: 'Get Row',
                value: 'getRow',
                action: 'Get table row',
                description: 'Returns a specific table row. More at https://rightech.io/en/developers/objects/table.',
            },
            {
                name: 'Get Rows',
                value: 'getManyRows',
                action: 'Get table rows',
                description: 'Returns table rows, optionally matching selected conditions. More at https://rightech.io/en/developers/objects/table.',
            },
        ],
        default: 'get',
    },
    {
        displayName: 'Table ID',
        name: 'tableId',
        required: true,
        type: 'resourceLocator',
        default: {
            mode: 'list',
            value: '',
        },
        displayOptions: {
            show: {
                resource: ['table'],
            },
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
    },
    {
        displayName: 'Table Row ID',
        name: 'tableRowId',
        required: true,
        type: 'resourceLocator',
        default: {
            mode: 'list',
            value: '',
        },
        displayOptions: {
            show: {
                resource: ['table'],
                operation: ['getRow'],
            },
        },
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                placeholder: 'Select a row...',
                typeOptions: {
                    searchListMethod: 'listRows',
                    searchable: true,
                    searchFilterRequired: false,
                },
            },
            ricUuidPropertyMode,
        ],
    },
    {
        displayName: 'Search Columns',
        name: 'tableQueryColumns',
        type: 'resourceMapper',
        default: {
            mappingMode: 'defineBelow',
            value: null,
        },
        displayOptions: {
            show: {
                resource: ['table'],
                operation: ['getManyRows'],
            },
        },
        typeOptions: {
            resourceMapper: {
                resourceMapperMethod: "mapTableRowQuery",
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
                resource: ['table'],
                operation: ['getManyRows'],
            },
        },
    },
];
