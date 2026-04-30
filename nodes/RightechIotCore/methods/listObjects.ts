import {ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult,} from "n8n-workflow";
import {httpCall, toSearchable} from "../common/util.js";

interface ObjectLookupSubsetFields {
    _id: string,
    name: string,
}

export async function listObjects(
    this: ILoadOptionsFunctions,
    filter?: string,
): Promise<INodeListSearchResult> {
    const responseData = await httpCall(this, {
        method: 'GET',
        url: '/api/v1/objects?limit=1000&only=_id,name',
        json: true,
    }) as ObjectLookupSubsetFields[];
    const results: INodeListSearchItems[] = responseData
        .filter(i => !filter || toSearchable(i, '_id', 'name').includes(filter))
        .map((item: ObjectLookupSubsetFields) => ({
            name: item.name,
            value: item._id,
        }));
    return {results, paginationToken: undefined};
}