import type {INodeProperties} from 'n8n-workflow';
import {get, userGetProperties} from "./get.js";
import {handlerFn} from "../../common/types.js";
import {getMany, userGetManyProperties} from "./getMany.js";

export const user: Record<string, handlerFn> = {get, getMany};

export const userApiProperties: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['user'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                action: 'Get a user',
                description: 'Loads general user information',
            },
            {
                name: 'Get Many',
                value: 'getMany',
                action: 'Get multiple users',
                description: 'Loads general user information for multiple users at once',
            },
        ],
        default: 'get',
    },
    ...userGetProperties,
    ...userGetManyProperties,
];
