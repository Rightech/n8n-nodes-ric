import {IHttpRequestOptions, ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult} from "n8n-workflow";
import {toSearchable} from "../common/util.js";

interface ObjectLookupSubsetFields {
    _id: string,
    name: string,
}

interface RicApiCred {
    ricServer: string,
}

export async function listObjects(
    this: ILoadOptionsFunctions,
    filter?: string,
): Promise<INodeListSearchResult> {
    let responseData: ObjectLookupSubsetFields[] = [];

    const cred = await this.getCredentials<RicApiCred>('rightechIotCloudApi');

    const request: IHttpRequestOptions = {
        method: 'GET',
        url: `${cred.ricServer}/api/v1/objects?limit=1000&only=_id,name`,
        json: true,
    };

    try {
        responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'rightechIotCloudApi', request);
    } catch (error) {
        return {
            results: [
                {name: "⚠️ " + error.toString(), value: 'error!'}
            ], paginationToken: undefined
        };
    }

    try {
        const results: INodeListSearchItems[] = responseData
            .map(i => toSearchable(i, '_id', 'name'))
            .filter(i => !filter || i._search.includes(filter))
            .map((item: ObjectLookupSubsetFields) => ({
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