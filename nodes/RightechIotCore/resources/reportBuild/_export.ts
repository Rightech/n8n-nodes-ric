import type {
	BinaryFileType,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { httpCall, parseContentDispositionFileName } from '../../common/util.js';
import { reportBuildId } from './properties.js';

const displayOptions = {
	show: {
		resource: ['reportBuild'],
		operation: ['_export'],
	},
};

export const exportReportBuildApiProperties: INodeProperties[] = [
	{
		...reportBuildId,
		required: true,
		displayOptions,
	},
	{
		displayName: 'Export Format',
		name: 'exportFormat',
		required: true,
		type: 'options',
		hint: 'Reports can contain multiple list with disparate data dimensions',
		default: 'json',
		options: [
			{
				name: 'JSON',
				value: 'json',
			},
			{
				name: 'XLSX',
				value: 'xlsx',
			},
			{
				name: 'PDF',
				value: 'pdf',
			},
			{
				name: 'CSV in Zip File',
				value: 'csv',
			},
		],
		displayOptions,
	},
];

export async function _export(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const reportBuildId = exec.getNodeParameter('reportBuildId.value', index) as string;
	const exportFormat = exec.getNodeParameter('exportFormat', index) as string;
	const responseData = (await httpCall(exec, {
		method: 'GET',
		url: `/api/v1/reports/builds/${reportBuildId}/export`,
		qs: {
			format: exportFormat,
		},
		encoding: 'arraybuffer',
		returnFullResponse: true,
	})) as {
		body: Buffer;
		headers: Record<string, string>; // is AxiosHeaders
		statusCode: number;
		statusMessage: string;
	};
	const preparedBinary = await exec.helpers.prepareBinaryData(
		responseData.body,
		undefined,
		responseData.headers['content-type'],
	);
	const knownFileType: Record<string, BinaryFileType> = { pdf: 'pdf', json: 'json' };
	const fileName = parseContentDispositionFileName(responseData.headers['content-disposition']);
	const result: INodeExecutionData = {
		json: {
			...exec.getInputData()[index]?.json,
			success: true,
		},
		binary: {
			report: {
				...preparedBinary,
				fileType: knownFileType[exportFormat] ?? undefined,
				fileName,
			},
		},
		pairedItem: { item: index },
	};
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(result), {
			itemData: { item: index },
		}),
	];
}
