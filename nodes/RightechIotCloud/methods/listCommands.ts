import {
    IHttpRequestOptions, ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult
} from "n8n-workflow";
import {toSearchable} from "../common/util.js";

interface ObjectSubModelShape {
    _actions?: CommandsIndexPerModel[],
}

interface CommandsIndexPerModel {
    id: string,
    name: string,
    type?: string,
}

interface RicApiCred {
    ricServer: string,
}

export async function listCommands(
    this: ILoadOptionsFunctions,
    filter?: string,
): Promise<INodeListSearchResult> {
    const objectId = this.getCurrentNodeParameter('objectId');
    if (!objectId || typeof objectId !== 'object' || !('__rl' in objectId) || !objectId.__rl || !objectId.value) {
        return {
            results: [], paginationToken: undefined
        };
    }
    let responseData: ObjectSubModelShape = {};

    const cred = await this.getCredentials<RicApiCred>('rightechIotCloudApi');

    const url = `${cred.ricServer}/api/v1/objects/${objectId.value}/model?only=model`;

    const request: IHttpRequestOptions = {
        method: 'GET',
        url,
        json: true,
    };

    try {
        responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'rightechIotCloudApi', request);
    } catch (error) {
        return {
            results: [
                {name: "⚠️ " + error.toString() + ` at ${url}`, value: 'error!'}
            ], paginationToken: undefined
        };
    }

    try {
        const results: INodeListSearchItems[] = (responseData._actions ?? [])
            .map(i => toSearchable(i, 'id', 'name'))
            .filter(i => !filter || i._search.includes(filter))
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