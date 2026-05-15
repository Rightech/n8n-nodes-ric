import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
	NodeApiError,
	NodeConnectionTypes,
} from 'n8n-workflow';
import { RicApiCredName } from './common/types.js';
import { eventOptions } from './methods/eventOptions.js';
import { eventOptionsOfObjects } from './methods/eventOptionsOfObjects.js';
import { listCommands } from './methods/listCommands.js';
import { listModels } from './methods/listModels.js';
import { listObjects } from './methods/listObjects.js';
import { listRows } from './methods/listRows.js';
import { listScenarios } from './methods/listScenarios.js';
import { listTables } from './methods/listTables.js';
import { listUsers } from './methods/listUsers.js';
import { mapObjectColumnsFromModel } from './methods/mapObjectColumnsFromModel.js';
import { mapObjectQueryFromModel } from './methods/mapObjectQueryFromModel.js';
import { mapTableRowQuery } from './methods/mapTableRowQuery.js';
import { mapTelemetryParams } from './methods/mapTelemetryParams.js';
import { eventApiProperties } from './resources/event/index.js';
import { modelApiProperties } from './resources/model/index.js';
import { objectApiProperties } from './resources/object/index.js';
import { route } from './resources/route.js';
import { scenarioApiProperties } from './resources/scenario/index.js';
import { tableApiProperties } from './resources/table/index.js';
import { userApiProperties } from './resources/user/index.js';

export class RightechIotCore implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Rightech IoT Core',
		name: 'rightechIotCore',
		icon: 'file:../../logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter.operation + ": " + $parameter.resource}}',
		description: 'Interact with the Rightech IoT Core API',
		documentationUrl: 'https://github.com/Rightech/n8n-nodes-ric',
		defaults: {
			name: 'Rightech IoT Core',
		},
		hints: [],
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: RicApiCredName, required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Event',
						value: 'event',
						description: 'Event log stores all occurred events',
					},
					{
						name: 'Model',
						value: 'model',
						description: 'Models define your object configuration shapes',
					},
					{
						name: 'Object',
						value: 'object',
						description: 'Objects represent your IoT devices',
					},
					{
						name: 'Scenario',
						value: 'scenario',
						description: 'Automation scenarios enable stateful automations with visual tools',
					},
					{
						name: 'Table',
						value: 'table',
						description: 'Data tables define arbitrary data shapes and store data',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Users of the platform instance',
					},
				],
				default: 'object',
			},
			...objectApiProperties,
			...modelApiProperties,
			...scenarioApiProperties,
			...tableApiProperties,
			...eventApiProperties,
			...userApiProperties,
		],
	};
	methods = {
		loadOptions: {
			eventOptions,
			eventOptionsOfObjects,
		},
		listSearch: {
			listObjects,
			listCommands,
			listModels,
			listScenarios,
			listTables,
			listRows,
			listUsers,
		},
		resourceMapping: {
			mapTableRowQuery,
			mapObjectQueryFromModel,
			mapObjectColumnsFromModel,
			mapTelemetryParams,
		},
	};
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			try {
				const results = await route(this, i);
				returnData.push(...results);
			} catch (error) {
				if (error instanceof Error) {
					error.message = error.message + ` [item ${i}]`;
				}
				if (this.continueOnFail()) {
					returnData.push(
						...this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray({
								error: new NodeApiError(this.getNode(), error as JsonObject),
							}),
							{ itemData: { item: i } },
						),
					);
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		}
		return [returnData];
	}
}
