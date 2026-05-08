import {IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError, ResourceMapperValue} from "n8n-workflow";
import {httpCall, setNestedValue} from "../../common/util.js";
import {modelSelector} from "../../common/properties.js";
import * as crypto from "node:crypto";

export const objectCreateProperties: INodeProperties[] = [
    {
        ...modelSelector,
        required: true,
        displayOptions: {
            show: {
                resource: ['object'],
                operation: ['create'],
            },
        }
    },
    {
        displayName: 'You can leave template parameters like <pre>`$tagname`</pre> or <pre>`$nanoid`</pre> as is to fill them with defaults dynamically.',
        name: 'CRUD template notice',
        type: 'notice',
        default: '',
        displayOptions: {
            show: {
                resource: ['object'],
                operation: ['create'],
            },
            hide: {
                modelId: [''],
            }
        }
    },
    {
        displayName: 'Model Options',
        name: 'modelOptions',
        type: 'resourceMapper',
        hint: 'Select a model to discover available parameters first.',
        default: {
            mappingMode: 'defineBelow',
            value: null,
        },
        displayOptions: {
            show: {
                resource: ['object'],
                operation: ['create'],
            },
            hide: {
                modelId: [''],
            }
        },
        typeOptions: {
            resourceMapper: {
                resourceMapperMethod: "mapObjectColumnsFromModel",
                mode: "add",
                addAllFields: false,
                supportAutoMap: false,
            }
        },
    },
];

interface CreateBody {
    id: string,
    model: string,
    name: string,
    config?: Record<string, unknown>,
    [key: string]: unknown,
}

export async function create(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const modelId = exec.getNodeParameter('modelId.value', index) as string;
    const modelOptions = exec.getNodeParameter('modelOptions', index) as ResourceMapperValue;
    const defaultId = modelOptions.schema.find(f => f.id === 'id')?.defaultValue?.toString() ?? '';
    const defaultName = modelOptions.schema.find(f => f.id === 'name')?.defaultValue?.toString() ?? '';
    const tagname = modelOptions.schema.find(f => f.id === '@tagname')?.defaultValue?.toString() ?? '';
    const idPrefix = modelOptions.schema.find(f => f.id === '@idPrefix')?.defaultValue?.toString() ?? '';
    const body: CreateBody = {
        id: defaultId,
        name: defaultName,
        model: modelId,
    };
    if (modelOptions.value) {
        for (const prop in modelOptions.value) {
            setNestedValue(body, prop, modelOptions.value[prop]);
        }
    }
    body.id = body.id
        .replace('$tagname', tagname)
        .replace('$nanoid', crypto.randomUUID().substring(0, 8));
    body.name = body.name
        .replace('$tagname', tagname)
        .replace('$nanoid', crypto.randomUUID().substring(0, 8));
    if (!body.id.match(/^[a-z0-9\-_:+]+$/)) {
        throw new NodeOperationError(exec.getNode(), `Specified object ID "${body.id}" contains symbols incompatible with IDs, please use only alphanumeric symbols and ":+_-" symbols.`);
    }
    if (idPrefix && !body.id.startsWith(idPrefix)) {
        throw new NodeOperationError(exec.getNode(), `Specified object ID "${body.id}" must start with "${idPrefix}".`);
    }
    const responseData = await httpCall(exec, {
        method: 'POST',
        url: `/api/v1/objects`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        json: true,
        body,
    }) as IDataObject;
    return [
        ...exec.helpers.constructExecutionMetaData(
            exec.helpers.returnJsonArray(responseData),
            {itemData: {item: index}},
        )
    ];
}
