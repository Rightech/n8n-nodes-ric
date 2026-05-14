import {
    IExecuteFunctions, IHttpRequestOptions, ILoadOptionsFunctions, NodeParameterValueType, ResourceMapperField,
    WorkflowConfigurationError
} from "n8n-workflow";
import {RicApiCred, RicApiCredName, RicModelConfigDescriptor, RicModelDataDescriptor} from "./types.js";

/**
 * Cast selected keys to lowercase for CI substring search
 * todo: go over use cases and convert to fuzzy API search when/if it becomes available
 */
export function toSearchable<T extends object>(item: T, ...fields: (keyof T)[]): string {
    return fields
        .map(field => field in item ? String(item[field]).toLowerCase() : '')
        .filter(part => part !== '')
        .join(' ');
}

export function readResourceLocatorId(node: ILoadOptionsFunctions, option: string): NodeParameterValueType {
    const idOption = node.getCurrentNodeParameter(option);
    if (idOption
        && typeof idOption === 'object'
        && '__rl' in idOption
        && idOption.__rl
        && idOption.value
    ) {
        return idOption.value;
    }
    return undefined;
}

export async function httpCall(exec: ILoadOptionsFunctions | IExecuteFunctions, request: IHttpRequestOptions): Promise<unknown> {
    const cred = await exec.getCredentials<RicApiCred>(RicApiCredName);
    if (!request.url) {
        throw new WorkflowConfigurationError(exec.getNode(), "Service URL was not set up, but workflow was executed.");
    }
    if (!request.url.startsWith('http')) {
        request.url = cred.ricServer.replace(/\/+$/g, '') + request.url;
    }
    return exec.helpers.httpRequestWithAuthentication.call(exec, RicApiCredName, request);
}

/**
 * Sets a value at a dot‑separated path inside an object, creating intermediate
 * plain objects only when needed. Never overwrites existing objects.
 */
export function setNestedValue(
    target: Record<string, unknown>,
    path: string,
    value: unknown
): void {
    if (!path.includes('.')) {
        target[path] = value;
        return
    }
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

export function ricConfigToResourceMapperField(config: RicModelConfigDescriptor): ResourceMapperField {
    return {
        id: `config.${config.id}`,
        displayName: config.name,
        type: config.dataType === 'table' ? 'string' : config.ctrl === 'Select' ? 'options' : config.dataType,
        required: false,
        defaultValue: config.defaultValue,
        defaultMatch: false,
        display: true,
        options: config.ctrl === 'Select' && config.opts ? config.opts.items : undefined,
    }
}

export function capitalise(some: string): string {
    return some.charAt(0).toUpperCase() + some.slice(1);
}

export function unrollModelDescriptors(data: RicModelDataDescriptor, idPrefix: string, namePrefix: string): RicModelDataDescriptor[] {
    const children = data.type === 'subsystem' || data.type === 'argument'
        ? (data.children ?? []).flatMap(c => unrollModelDescriptors(c, `${data.id}.`, `${data.name}: `))
        : [];
    return [
        {
            ...data,
            id: `${idPrefix}${data.id}`,
            name: `${namePrefix}${data.name}`
        },
        ...children
    ];
}

