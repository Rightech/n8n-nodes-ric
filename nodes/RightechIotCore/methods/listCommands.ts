import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { httpCall, readResourceLocatorId, toSearchable } from '../common/util.js';

interface ObjectSubModelShape {
	_actions?: CommandsIndexPerModel[];
}

interface CommandsIndexPerModel {
	id: string;
	name: string;
	type?: string;
}

export async function listCommands(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const objectId = readResourceLocatorId(this, 'objectId');
	if (!objectId) {
		return {
			results: [],
			paginationToken: undefined,
		};
	}
	const responseData = (await httpCall(this, {
		method: 'GET',
		url: `/api/v1/objects/${objectId}/model?only=model`,
		json: true,
	})) as ObjectSubModelShape;
	const results: INodeListSearchItems[] = (responseData._actions ?? [])
		.filter((i) => !filter || toSearchable(i, 'id', 'name').includes(filter))
		.map((item: CommandsIndexPerModel) => ({
			name: item.name,
			value: item.id,
		}));
	return { results, paginationToken: undefined };
}
