import type {
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	ResourceMapperFields,
} from 'n8n-workflow';
import type { RicApiTableIndex } from '../common/types.js';
import { httpCall, readResourceLocatorId } from '../common/util.js';

export async function mapTableRowQuery(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
	const tableId = readResourceLocatorId(this, 'tableId');
	if (!tableId) {
		return {
			fields: [],
			emptyFieldsNotice: 'Select a table to search by columns.',
		};
	}
	const request: IHttpRequestOptions = {
		method: 'GET',
		url: `/api/v1/tables/${tableId}`,
		json: true,
	};
	try {
		const responseData = (await httpCall(this, request)) as RicApiTableIndex;
		return {
			fields: responseData.columns.map((c) => ({
				id: `where.data.${c.id}`,
				displayName: c.name,
				type: c.dataType === 'date' ? 'dateTime' : c.dataType,
				required: false,
				defaultMatch: false,
				readOnly: false,
				removed: false,
				display: true,
			})),
			emptyFieldsNotice: responseData.columns.length === 0 ? 'Table has no columns!' : undefined,
		};
	} catch (error) {
		return {
			fields: [],
			emptyFieldsNotice: 'Failed to load configuration: ' + error.toString(),
		};
	}
}
