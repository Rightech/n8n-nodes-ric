import {IHttpRequestOptions, ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult} from "n8n-workflow";
import {toSearchable} from "../common/util.js";
import {RicApiCred, RicApiCredName, RicApiTableIndex} from "../common/types.js";

export async function listTables(
    this: ILoadOptionsFunctions,
    filter?: string,
): Promise<INodeListSearchResult> {
    let responseData: RicApiTableIndex[] = [];
    const cred = await this.getCredentials<RicApiCred>(RicApiCredName);
    const request: IHttpRequestOptions = {
        method: 'GET',
        url: `${cred.ricServer}/api/v1/tables`,
        json: true,
    };
    try {
        responseData = await this.helpers.httpRequestWithAuthentication.call(this, RicApiCredName, request);
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