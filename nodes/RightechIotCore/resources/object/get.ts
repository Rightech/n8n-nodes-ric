import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import type { INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import { httpCall } from '../../common/util.js';

export async function get(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const objectId = exec.getNodeParameter('objectId', index) as INodeParameterResourceLocator;
	const responseData = (await httpCall(exec, {
		method: 'GET',
		url: `/api/v1/objects/${objectId.value}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	})) as IDataObject;
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
