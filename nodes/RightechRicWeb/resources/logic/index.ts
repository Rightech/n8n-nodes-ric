import type {INodeProperties} from 'n8n-workflow';

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
                name: 'Start automation',
                value: 'logicStart',
                action: 'Start automation on an object',
                description: 'https://rightech.io/en/developers/http/logic#execute-start',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/objects/{{$parameter.objectId}}/automatons/{{$parameter.automatonId}}/start',
                    },
                },
            },
            {
                name: 'Stop automation',
                value: 'logicStop',
                action: 'Stop automation on an object',
                description: 'https://rightech.io/en/developers/http/logic#execute-stop',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/objects/{{$parameter.objectId}}/automatons/{{$parameter.automatonId}}/stop',
                    },
                },
            },
            {
                name: 'Emit automation event',
                value: 'logicEmit',
                action: 'Emit automation event to a running automation',
                description: 'https://rightech.io/en/developers/http/logic#emit',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/objects/{{$parameter.objectId}}/automatons/{{$parameter.automatonId}}/emit',
                        // todo: { "event": "<event-id>" }
                    },
                },
            },
        ],
        default: 'logicStart',
    },
    {
        name: 'objectId',
        displayName: 'Object ID',
        required: true,
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['logic'],
            },
        },
    },
    {
        name: 'automatonId',
        displayName: 'Logic automation ID',
        required: true,
        type: 'resourceLocator',
        default: '',
        displayOptions: {
            show: {
                resource: ['logic'],
            },
        },
        modes: [
            {
                displayName: 'ID',
                name: 'id',
                type: 'string',
                hint: 'Enter an ID',
                validation: [
                    {
                        type: 'regex',
                        properties: {
                            regex: '^[a-z0-9]{24}$',
                            errorMessage: 'UUID is 24 alphanumeric symbols.',
                        },
                    },
                ],
                placeholder: '5951113beb39561100fd5bbb',
            },
            {
                displayName: 'List',
                name: 'list',
                type: 'list',
                typeOptions: {
                    searchListMethod: 'listAutomatons',
                    searchable: true,
                    searchFilterRequired: false,
                },
            },
        ],
    },
];
