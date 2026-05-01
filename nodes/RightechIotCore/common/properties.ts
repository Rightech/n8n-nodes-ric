import {INodeProperties, INodePropertyMode} from "n8n-workflow";

// because INodePropertyMode does not have defaults
// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
export const ricUuidPropertyMode: INodePropertyMode = {
    displayName: 'By ID',
    name: 'id',
    type: 'string',
    placeholder: 'e.g. 5951113beb39561100fd5bbb',
    hint: 'If you need to manually reference an ID of some thing, you can find it in the browser URL while looking at the thing in RIC web UI.',
    validation: [
        {
            type: 'regex',
            properties: {
                regex: '^[a-z0-9]{0,24}$',
                errorMessage: 'ID must be 24 alphanumeric symbols.',
            },
        },
    ],
};

export const objectSelector: INodeProperties = {
    displayName: 'Object ID',
    name: 'objectId',
    required: true,
    type: 'resourceLocator',
    default: {
        mode: 'list',
        value: '',
    },
    modes: [
        {
            displayName: 'From List',
            name: 'list',
            type: 'list',
            placeholder: 'Select an object...',
            typeOptions: {
                searchListMethod: 'listObjects',
                searchable: true,
                searchFilterRequired: false,
            },
        },
        ricUuidPropertyMode,
    ],
};

export const modelSelector: INodeProperties = {
    displayName: 'Model ID',
    name: 'modelId',
    type: 'resourceLocator',
    default: {
        mode: 'list',
        value: '',
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
};

export interface stdQueryParametersType {
    from?: string,
    to?: string,
    limit?: number,
    offset?: number,
}

export const stdQueryParameters: INodeProperties = {
    displayName: 'Standard Search Parameters',
    name: 'stdQueryParameters',
    type: 'collection',
    placeholder: 'Add Parameter',
    hint: 'Standard parameters for all searches. More at https://rightech.io/en/developers/http/base#get-all.',
    default: {},
    options: [
        {
            displayName: 'Created After',
            name: 'from', // ISO 8601, Unix time
            hint: 'Select only items created after this time',
            type: 'dateTime',
            default: '',
        },
        {
            displayName: 'Created Before',
            name: 'to',
            hint: 'Select only items created before this time',
            type: 'dateTime',
            default: '',
        },
        {
            displayName: 'Result Limit',
            name: 'limit',
            description: 'Max number of results to return',
            hint: 'Max number of results to return',
            type: 'number',
            typeOptions: {
                minValue: 1,
                maxValue: 10000,
            },
            default: 50,
        },
        {
            displayName: 'Lookup Offset',
            name: 'offset',
            hint: 'Specify an offset parameter to get more data',
            type: 'number',
            default: '',
        },
    ],
};
