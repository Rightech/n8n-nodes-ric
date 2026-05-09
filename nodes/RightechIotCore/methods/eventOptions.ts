import {ILoadOptionsFunctions, INodePropertyOptions} from "n8n-workflow";
import {httpCall} from "../common/util.js";
import {RicEventOrgStructure} from "../common/types.js";

const knownEvents: Record<string, string> = {
    'object-online': 'Object: comes online',
    'object-offline': 'Object: comes offline',
    'object-insert': 'Object: created',
    'object-update': 'Object: updated',
    'object-remove': 'Object: deleted',
    'object-command-req': 'Command: sent',
    'object-command-res': 'Command: completed',
    'object-command-err': 'Command: failed',
};

const knownEventTypes = Object.keys(knownEvents);

export async function eventOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const responseData = await httpCall(this, {
        method: 'GET',
        url: `/api/v1/events/org`,
        json: true,
    }) as RicEventOrgStructure;
    return [
        ...knownEventTypes.map(e => ({
            name: knownEvents[e],
            value: e,
        })),
        ...responseData.unique
            .filter(e => !responseData.noModel.includes(e) && !knownEventTypes.includes(e))
            .sort()
            .map(e => ({
                name: `Custom: ${e}`,
                value: e,
            })),
        ...responseData.noModel
            .sort()
            .map(e => ({
                name: `System: ${e}`,
                value: e,
            })),
    ];
}
