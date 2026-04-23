import {IHttpRequestOptions, ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult} from "n8n-workflow";

interface AutomatonIndex {
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

export async function listAutomatons(
    this: ILoadOptionsFunctions,
    filter?: string,
    paginationToken?: string,
): Promise<INodeListSearchResult> {
    let responseData: AutomatonIndex[] = [];

    let cred = await this.getCredentials<RightechRicWebApiCred>('RightechRicWebApi');

    const request: IHttpRequestOptions = {
        method: 'GET',
        url: `${cred.ricServer}/automatons`,
        json: true,
    };

    try {
        responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'RightechRicWebApi', request);
    } catch (error) {
        return {
            results: [
                {name: error.toString(), value: 'error!'}
            ], paginationToken: undefined
        };
    }

    try {
        const results: INodeListSearchItems[] = responseData
            .filter(i => !filter || i.name.includes(filter) || i._id.includes(filter))
            .map((item: AutomatonIndex) => ({
                name: item.name,
                value: item._id,
                description: item.description,
            }));

        return {results, paginationToken: undefined};
    } catch (error) {
        return {
            results: [
                {name: error.toString(), value: 'error!'}
            ], paginationToken: undefined
        };
    }
}