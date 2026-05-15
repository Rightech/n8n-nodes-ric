import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { httpCall, readResourceLocatorId } from '../common/util.js';

interface RowsIndex {
	_id: string;
	time: number;
	data: Record<string, boolean | number | string>;
}

export async function listRows(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const tableId = readResourceLocatorId(this, 'tableId');
	if (!tableId) {
		return {
			results: [],
			paginationToken: undefined,
		};
	}
	const responseData = (await httpCall(this, {
		method: 'GET',
		url: `/api/v1/tables/${tableId}/rows`,
		json: true,
	})) as RowsIndex[];
	const results: INodeListSearchItems[] = responseData
		// todo: this is problematic because there can be a lot of rows but API can't be used to look them up well (substrings and such), so return set will be limited
		.filter((i) => !filter || Object.values(i.data).join(' ').includes(filter))
		.map((item: RowsIndex) => ({
			// todo: can load table schema to detect preferred name field
			name:
				Object.keys(item.data)
					.slice(0, 5)
					.map((k: keyof RowsIndex['data']) => item.data[k])
					.join(' | ') || item._id,
			value: item._id,
		}));
	return { results, paginationToken: undefined };
}
