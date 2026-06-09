import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { httpCall } from '../common/util.js';

interface TaskSubsetFields {
	_id: string;
	name?: string;
}

export async function loadOptionsOfTaskKinds(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const responseData = (await httpCall(this, {
		method: 'GET',
		url: '/api/v1/tasks/kinds?only=_id,name',
		json: true,
	})) as TaskSubsetFields[];
	return [
		...responseData
			.filter((i): i is { _id: string; name: string } => !!i.name)
			.sort((a, b) => a.name.localeCompare(b.name))
			.map((i) => ({
				name: i.name,
				value: i._id,
			}))
			.sort(),
	];
}
