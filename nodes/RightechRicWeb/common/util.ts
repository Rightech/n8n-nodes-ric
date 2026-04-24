/**
 * Cast selected keys to lowercase for CI substring search
 * todo: go over use cases and convert to fuzzy API search when/if it becomes available
 */
export function toSearchable<T extends object>(item: T, ...fields: string[]): T & { _search: string } {
    const _search = fields
        .map(field => item in field ? String(item[field]).toLowerCase() : '')
        .filter(part => part !== '')
        .join(' ');

    return {...item, _search};
}