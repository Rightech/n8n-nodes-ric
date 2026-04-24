import {INodeProperties, INodePropertyMode} from "n8n-workflow";

// because INodePropertyMode does not have defaults
// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
export const ricUuidPropertyMode: INodePropertyMode = {
    displayName: 'ID',
    name: 'id',
    type: 'string',
    hint: 'Enter an ID',
    validation: [
        {
            type: 'regex',
            properties: {
                regex: '^[a-z0-9]{24}$',
                errorMessage: 'ID is 24 alphanumeric symbols.',
            },
        },
    ],
    placeholder: 'e.g. 5951113beb39561100fd5bbb',
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
            displayName: 'List',
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
