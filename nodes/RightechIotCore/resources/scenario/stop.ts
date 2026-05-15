import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import type { INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import { objectSelector, ricUuidPropertyMode } from '../../common/properties.js';
import { httpCall } from '../../common/util.js';

const displayOptions = {
	show: {
		resource: ['scenario'],
		operation: ['stop'],
	},
};

export const scenarioStopProperties: INodeProperties[] = [
	{
		...objectSelector,
		displayOptions,
	},
	{
		displayName: 'Scenario',
		name: 'scenarioId',
		required: true,
		type: 'resourceLocator',
		default: {
			mode: 'list',
			value: '',
		},
		displayOptions,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a scenario...',
				typeOptions: {
					searchListMethod: 'listScenarios',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			ricUuidPropertyMode,
		],
	},
];

export async function stop(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const objectId = exec.getNodeParameter('objectId', index) as INodeParameterResourceLocator;
	const scenarioId = exec.getNodeParameter('scenarioId', index) as INodeParameterResourceLocator;
	const responseData = (await httpCall(exec, {
		method: 'POST',
		url: `/api/v1/objects/${objectId.value}/automatons/${scenarioId.value}/stop`,
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
