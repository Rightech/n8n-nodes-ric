import {ILoadOptionsFunctions} from "n8n-workflow";
import {NodeParameterValueType} from "n8n-workflow/dist/esm/interfaces.js";

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
