import {IHttpRequestOptions, ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult} from "n8n-workflow";
import {toSearchable} from "../common/util.js";

interface ScenarioIndex {
    _id: string,
    name: string,
    description?: string,
    model: string,
    models: string[],
    type?: 'template',
    base?: string,
    processId?: string,
    target?: string | null,
    targets?: string[],
    version?: number,
}

interface RightechRicWebApiCred {
    ricServer: string,
}

export async function listScenarios(
    this: ILoadOptionsFunctions,
    filter?: string,
): Promise<INodeListSearchResult> {
    let responseData: ScenarioIndex[] = [];

    const cred = await this.getCredentials<RightechRicWebApiCred>('rightechRicWebApi');

    const request: IHttpRequestOptions = {
        method: 'GET',
        url: `${cred.ricServer}/automatons`,
        json: true,
    };

    try {
        responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'rightechRicWebApi', request);
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
            .map((item: ScenarioIndex) => ({
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