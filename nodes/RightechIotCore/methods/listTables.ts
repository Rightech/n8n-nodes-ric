import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import type { RicApiTableIndex } from '../common/types.js';
import { httpCall, isCiStringInProps } from '../common/util.js';

export async function listTables(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const responseData = (await httpCall(this, {
		method: 'GET',
		url: '/api/v1/tables',
		json: true,
	})) as RicApiTableIndex[];
	const results: INodeListSearchItems[] = responseData
		.filter((i) => !filter || isCiStringInProps(filter, i, '_id', 'name'))
		.map((item: RicApiTableIndex) => ({
			name: item.name,
			value: item._id,
		}));
	return { results, paginationToken: undefined };
}
