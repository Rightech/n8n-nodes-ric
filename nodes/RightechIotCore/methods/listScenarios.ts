import {ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult} from "n8n-workflow";
import {httpCall, toSearchable} from "../common/util.js";

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

export async function listScenarios(
    this: ILoadOptionsFunctions,
    filter?: string,
): Promise<INodeListSearchResult> {
    const responseData = await httpCall(this, {
        method: 'GET',
        url: '/api/v1/automatons',
        json: true,
    }) as ScenarioIndex[];
    const results: INodeListSearchItems[] = responseData
        .filter(i => !filter || toSearchable(i, '_id', 'name').includes(filter))
        .map((item: ScenarioIndex) => ({
            name: item.name,
            value: item._id,
        }));
    return {results, paginationToken: undefined};
}