import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { httpCall, isCiStringInProps } from '../common/util.js';

interface ObjectLookupSubsetFields {
	_id: string;
	id: string;
	name: string;
}

export async function listObjects(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const responseData = (await httpCall(this, {
		method: 'GET',
		url: '/api/v1/objects?limit=1000&only=_id,id,name',
		json: true,
	})) as ObjectLookupSubsetFields[];
	const results: INodeListSearchItems[] = responseData
		.filter((i) => !filter || isCiStringInProps(filter, i, '_id', 'id', 'name'))
		.map((item: ObjectLookupSubsetFields) => ({
			name: item.name,
			value: item._id,
		}));
	return { results, paginationToken: undefined };
}
