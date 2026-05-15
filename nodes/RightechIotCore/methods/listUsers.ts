import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { httpCall } from '../common/util.js';

interface UsersLookupSubsetFields {
	_id: string;
	name: string;
}

export async function listUsers(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	this.logger.info('ran with ' + filter);
	const responseData = (await httpCall(this, {
		method: 'GET',
		url: '/api/v1/users?limit=1000&only=_id,name',
		json: true,
		qs: {
			search: filter,
		},
	})) as UsersLookupSubsetFields[];
	const results: INodeListSearchItems[] = responseData.map((item: UsersLookupSubsetFields) => ({
		name: item.name,
		value: item._id,
	}));
	return { results, paginationToken: undefined };
}
