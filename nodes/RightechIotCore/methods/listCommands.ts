import {
    IHttpRequestOptions, ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult
} from "n8n-workflow";
import {readResourceLocatorId, toSearchable} from "../common/util.js";
import {RicApiCred, RicApiCredName} from "../common/types.js";

interface ObjectSubModelShape {
    _actions?: CommandsIndexPerModel[],
}

interface CommandsIndexPerModel {
    id: string,
    name: string,
    type?: string,
}

export async function listCommands(
    this: ILoadOptionsFunctions,
    filter?: string,
): Promise<INodeListSearchResult> {
    const objectId = readResourceLocatorId(this, 'objectId');
    if (!objectId) {
        return {
            results: [], paginationToken: undefined
        };
    }
    let responseData: ObjectSubModelShape = {};

    const cred = await this.getCredentials<RicApiCred>(RicApiCredName);

    const url = `${cred.ricServer}/api/v1/objects/${objectId}/model?only=model`;

    const request: IHttpRequestOptions = {
        method: 'GET',
        url,
        json: true,
    };

    try {
        responseData = await this.helpers.httpRequestWithAuthentication.call(this, RicApiCredName, request);
    } catch (error) {
        return {
            results: [
                {name: "⚠️ " + error.toString() + ` at ${url}`, value: 'error!'}
            ], paginationToken: undefined
        };
    }

    try {
        const results: INodeListSearchItems[] = (responseData._actions ?? [])
            .filter(i => !filter || toSearchable(i, 'id', 'name').includes(filter))
            .map((item: CommandsIndexPerModel) => ({
                name: item.name,
                value: item.id,
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