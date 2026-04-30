import {
    ILoadOptionsFunctions,
    INodeListSearchItems,
    INodeListSearchResult,
} from "n8n-workflow";
import {httpCall, toSearchable} from "../common/util.js";

interface ModelLookupSubsetFields {
    _id: string,
    name: string,
}

export async function listModels(
    this: ILoadOptionsFunctions,
    filter?: string,
): Promise<INodeListSearchResult> {
    const responseData = await httpCall(this, {
        method: 'GET',
        url: '/api/v1/models?limit=1000&only=_id,name',
        json: true,
    }) as ModelLookupSubsetFields[];
    const results: INodeListSearchItems[] = responseData
        .filter(i => !filter || toSearchable(i, '_id', 'name').includes(filter))
        .map((item: ModelLookupSubsetFields) => ({
            name: item.name,
            value: item._id,
        }));
    return {results, paginationToken: undefined};
}