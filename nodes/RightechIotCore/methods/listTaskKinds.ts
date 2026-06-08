import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { httpCall, isCiStringInProps } from '../common/util.js';

interface TaskSubsetFields {
	_id: string;
	name?: string;
}

export async function listTaskKinds(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const responseData = (await httpCall(this, {
		method: 'GET',
		url: '/api/v1/tasks/kinds?only=_id,name',
		json: true,
	})) as TaskSubsetFields[];
	const results: INodeListSearchItems[] = responseData
		.filter((i): i is { _id: string; name: string } => !!i.name)
		.filter((i) => !filter || isCiStringInProps(filter, i, '_id', 'name'))
		.map((item) => ({
			name: item.name,
			value: item._id,
		}));
	return { results, paginationToken: undefined };
}
