import type {INodeProperties} from 'n8n-workflow';
import {get, tableGetProperties} from "./get.js";
import {getRow, tableGetRowProperties} from "./getRow.js";
import {getManyRows, tableGetManyProperties} from "./getManyRows.js";
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
    ...tableGetProperties,
    ...tableGetManyProperties,
    ...tableGetRowProperties,
];
