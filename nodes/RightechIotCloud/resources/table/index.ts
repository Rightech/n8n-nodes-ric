import type {INodeProperties} from 'n8n-workflow';
import {ricUuidPropertyMode} from "../../common/properties.js";

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
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/tables/{{$parameter.tableId}}',
                    },
                },
            },
            {
                name: 'Get Row',
                value: 'getRow',
                action: 'Get table row',
                description: 'Returns a specific table row. More at https://rightech.io/en/developers/objects/table.',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/tables/{{$parameter.tableId}}/rows{{$parameter.tableRowId}}',
                    },
                },
            },
            {
                name: 'Get Rows',
                value: 'getRows',
                action: 'Get table rows',
                description: 'Returns table rows, optionally matching selected conditions. More at https://rightech.io/en/developers/objects/table.',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/tables/{{$parameter.tableId}}/rows',
                    },
                },
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
        name: 'queryColumns',
        type: 'resourceMapper',
        default: {
            mappingMode: 'defineBelow',
            value: null,
        },
        displayOptions: {
            show: {
                resource: ['table'],
                operation: ['getRows'],
            },
        },
        typeOptions: {
            resourceMapper: {
                resourceMapperMethod: "mapTableRowQuery",
                mode: "add",
                addAllFields: true,
            }
        }
        // todo: cannot be routed to qs - need to use programmatic node
    },
];
