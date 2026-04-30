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
                regex: '^[a-z0-9]{24}$',
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
