import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { httpCall, isCiStringInProps } from '../../common/util.js';

export async function listReports(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const responseData = (await httpCall(this, {
		method: 'GET',
		url: '/api/v1/reports?only=_id,name',
		json: true,
	})) as {
		_id: string;
		name: string;
	}[];
	const results: INodeListSearchItems[] = responseData
		.filter((i) => !filter || isCiStringInProps(filter, i, '_id', 'name'))
		.map((item) => ({
			name: item.name,
			value: item._id,
		}));
	return { results, paginationToken: undefined };
}
