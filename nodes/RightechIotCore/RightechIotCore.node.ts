import {
    IExecuteFunctions,
    INodeExecutionData,
    type INodeType,
    type INodeTypeDescription, JsonObject, NodeApiError,
    NodeConnectionTypes
} from 'n8n-workflow';
import {scenarioApiProperties} from "./resources/scenario/index.js";
import {objectApiProperties} from "./resources/object/index.js";
import {listScenarios} from "./methods/listScenarios.js";
import {listObjects} from "./methods/listObjects.js";
import {listCommands} from "./methods/listCommands.js";
import {tableApiProperties} from "./resources/table/index.js";
import {listTables} from "./methods/listTables.js";
import {listRows} from "./methods/listRows.js";
import {mapTableRowQuery} from "./methods/mapTableRowQuery.js";
import {RicApiCredName} from "./common/types.js";
import {route} from "./resources/route.js";
import {modelApiProperties} from "./resources/model/index.js";
import {listModels} from "./methods/listModels.js";
import {mapObjectQuery} from "./methods/mapObjectQuery.js";

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
        credentials: [
            {name: RicApiCredName, required: true}
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Object',
                        value: 'object',
                        description: 'Objects bound to your IoT devices',
                    },
                    {
                        name: 'Model',
                        value: 'model',
                        description: 'Models define your object configuration',
                    },
                    {
                        name: 'Scenario',
                        value: 'scenario',
                        description: 'Automation scenarios',
                    },
                    {
                        name: 'Table',
                        value: 'table',
                        description: 'Data tables',
                    },
                ],
                default: 'object',
            },
            ...objectApiProperties,
            ...modelApiProperties,
            ...scenarioApiProperties,
            ...tableApiProperties,
        ],
    };
    methods = {
        listSearch: {
            listObjects,
            listCommands,
            listModels,
            listScenarios,
            listTables,
            listRows,
        },
        resourceMapping: {
            mapTableRowQuery,
            mapObjectQuery,
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
                error.message = error.message + ` [item ${i}]`;
                if (this.continueOnFail()) {
                    returnData.push(...(this.helpers.constructExecutionMetaData(
                        this.helpers.returnJsonArray({error: new NodeApiError(this.getNode(), error as JsonObject)}),
                        {itemData: {item: i}},
                    )));
                    continue;
                }
                throw new NodeApiError(this.getNode(), error as JsonObject);
            }
        }
        return [returnData];
    }
}
