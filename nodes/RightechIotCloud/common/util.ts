/**
 * Cast selected keys to lowercase for CI substring search
 * todo: go over use cases and convert to fuzzy API search when/if it becomes available
 */
export function toSearchable<T extends object>(item: T, ...fields: (keyof T)[]): T & { _search: string } {
    const _search = fields
        .map(field => field in item ? String(item[field]).toLowerCase() : '')
        .filter(part => part !== '')
        .join(' ');

    return {...item, _search};
}