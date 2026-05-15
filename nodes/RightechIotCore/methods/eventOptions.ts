import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { type RicEventOrgStructure, RicKnownEvents } from '../common/types.js';
import { httpCall } from '../common/util.js';

const knownEventTypes = Object.keys(RicKnownEvents);

export async function eventOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const responseData = (await httpCall(this, {
		method: 'GET',
		url: `/api/v1/events/org`,
		json: true,
	})) as RicEventOrgStructure;
	return [
		...knownEventTypes.map((e) => ({
			name: RicKnownEvents[e],
			value: e,
		})),
		...responseData.unique
			.filter((e) => !responseData.noModel.includes(e) && !knownEventTypes.includes(e))
			.sort()
			.map((e) => ({
				name: `Custom: ${e}`,
				value: e,
			})),
		...responseData.noModel.sort().map((e) => ({
			name: `System: ${e}`,
			value: e,
		})),
	];
}
