import {ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult} from "n8n-workflow";
import {httpCall, toSearchable} from "../common/util.js";
import {RicApiTableIndex} from "../common/types.js";

export async function listTables(
    this: ILoadOptionsFunctions,
    filter?: string,
): Promise<INodeListSearchResult> {
    const responseData = await httpCall(this, {
        method: 'GET',
        url: '/api/v1/tables',
        json: true,
    }) as RicApiTableIndex[];
    const results: INodeListSearchItems[] = responseData
        .filter(i => !filter || toSearchable(i, '_id', 'name').includes(filter))
        .map((item: RicApiTableIndex) => ({
            name: item.name,
            value: item._id,
        }));
    return {results, paginationToken: undefined};
}