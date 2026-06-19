import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { httpCall } from '../../common/util.js';

export async function loadOptionsObjects(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const responseData = (await httpCall(this, {
		method: 'GET',
		url: `/api/v1/objects?only=_id,name&sortBy=name&limit=10000`,
		json: true,
	})) as {
		_id: string;
		name: string;
	}[];
	return responseData.map((o) => ({
		name: o.name,
		value: o._id,
	}));
}
