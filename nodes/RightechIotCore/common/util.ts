import {IExecuteFunctions, IHttpRequestOptions, ILoadOptionsFunctions, NodeParameterValueType,
    WorkflowConfigurationError
} from "n8n-workflow";
import {RicApiCred, RicApiCredName} from "./types.js";

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

export async function httpCall(exec: ILoadOptionsFunctions|IExecuteFunctions, request: IHttpRequestOptions): Promise<unknown> {
    const cred = await exec.getCredentials<RicApiCred>(RicApiCredName);
    if (!request.url) {
        throw new WorkflowConfigurationError(exec.getNode(), "Service URL was not set up, but workflow was executed.");
    }
    if (!request.url.startsWith('http')) {
        request.url = cred.ricServer.replace(/\/+$/g, '') + request.url;
    }
    return exec.helpers.httpRequestWithAuthentication.call(exec, RicApiCredName, request);
}
