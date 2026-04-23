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
        displayName: 'Object ID',
        name: 'objectId',
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
        displayName: 'Logic Automation ID',
        name: 'automatonId',
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
