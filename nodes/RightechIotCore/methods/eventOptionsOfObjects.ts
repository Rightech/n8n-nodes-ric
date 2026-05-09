import {ILoadOptionsFunctions, INodePropertyOptions} from "n8n-workflow";
import {httpCall} from "../common/util.js";
import {RicEventOrgStructure, RicKnownEvents} from "../common/types.js";

const knownEventTypes = Object.keys(RicKnownEvents);

export async function eventOptionsOfObjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const responseData = await httpCall(this, {
        method: 'GET',
        url: `/api/v1/events/org`,
        json: true,
    }) as RicEventOrgStructure;
    return [
        ...knownEventTypes.map(e => ({
            name: RicKnownEvents[e],
            value: e,
        })),
        ...responseData.unique
            .filter(e => !responseData.noModel.includes(e) && !knownEventTypes.includes(e))
            .sort()
            .map(e => ({
                name: `Custom: ${e}`,
                value: e,
            })),
    ];
}
