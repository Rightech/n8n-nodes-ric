import {NodeConnectionTypes, type INodeType, type INodeTypeDescription} from 'n8n-workflow';
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

export class RightechIotCloud implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Rightech IoT Core',
        name: 'rightechIotCloud',
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
        requestDefaults: {
            baseURL: '={{$credentials.ricServer}}/api/v1',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
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
            ...scenarioApiProperties,
            ...objectApiProperties,
            ...tableApiProperties,
        ],
    };
    methods = {
        listSearch: {
            listScenarios,
            listObjects,
            listCommands,
            listTables,
            listRows,
        },
        resourceMapping: {
            mapTableRowQuery,
        },
    }
}
