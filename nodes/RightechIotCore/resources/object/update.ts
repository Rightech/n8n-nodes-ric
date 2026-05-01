import {IDataObject, IExecuteFunctions, INodeExecutionData, ResourceMapperValue} from "n8n-workflow";
import {httpCall} from "../../common/util.js";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";

interface UpdateBody {
    config?: Record<string, unknown>
}

/**
 * Sets a value at a dot‑separated path inside an object, creating intermediate
 * plain objects only when needed. Never overwrites existing objects.
 */
function setNestedValue(
    target: Record<string, unknown>,
    path: string,
    value: unknown
): void {
    const keys = path.split('.');
    let current: Record<string, unknown> = target;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const next = current[key];
        // If the next level is already a plain object, use it.
        if (next !== null && typeof next === 'object' && !Array.isArray(next)) {
            current = next as Record<string, unknown>;
        } else {
            // Otherwise create a fresh object (and never overwrite an array, etc.)
            const newObj: Record<string, unknown> = {};
            current[key] = newObj;
            current = newObj;
        }
    }
    current[keys[keys.length - 1]] = value;
}

export async function update(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const objectId = exec.getNodeParameter('objectId', index) as INodeParameterResourceLocator;
    const modelOptions = exec.getNodeParameter('modelOptions', index) as ResourceMapperValue;
    const body: UpdateBody = {};
    if (modelOptions.value) {
        body.config = {};
        for (const prop in modelOptions.value) {
            if (prop.includes('.')) {
                setNestedValue(body.config, prop, modelOptions.value[prop]);
            } else {
                body.config[prop] = modelOptions.value[prop];
            }
        }
    }
    const responseData = await httpCall(exec, {
        method: 'PATCH',
        url: `/api/v1/objects/${objectId.value}`,
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
