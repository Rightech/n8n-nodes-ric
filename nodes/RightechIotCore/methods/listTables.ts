import {IHttpRequestOptions, ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult} from "n8n-workflow";
import {httpCall, toSearchable} from "../common/util.js";
import {RicApiTableIndex} from "../common/types.js";

export async function listTables(
    this: ILoadOptionsFunctions,
    filter?: string,
): Promise<INodeListSearchResult> {
    let responseData: RicApiTableIndex[] = [];
    const request: IHttpRequestOptions = {
        method: 'GET',
        url: '/api/v1/tables',
        json: true,
    };
    try {
        responseData = await httpCall(this, request) as RicApiTableIndex[];
    } catch (error) {
        return {
            results: [
                {name: "⚠️ " + error.toString(), value: 'error!'}
            ], paginationToken: undefined
        };
    }
    try {
        const results: INodeListSearchItems[] = responseData
            .filter(i => !filter || toSearchable(i, '_id', 'name').includes(filter))
            .map((item: RicApiTableIndex) => ({
                name: item.name,
                value: item._id,
            }));
        return {results, paginationToken: undefined};
    } catch (error) {
        return {
            results: [
                {name: "⚠️ " + error.toString(), value: 'error!'}
            ], paginationToken: undefined
        };
    }
}