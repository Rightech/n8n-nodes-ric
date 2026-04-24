import {NodeConnectionTypes, type INodeType, type INodeTypeDescription} from 'n8n-workflow';
import {scenarioApiProperties} from "./resources/scenario/index.js";
import {objectApiProperties} from "./resources/object/index.js";
import {listScenarios} from "./methods/listScenarios.js";
import {listObjects} from "./methods/listObjects.js";
import {listCommands} from "./methods/listCommands.js";

export class RightechIotCloud implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Rightech IoT Cloud',
        name: 'rightechIotCloud',
        icon: 'file:../../logo.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter.operation + ": " + $parameter.resource}}',
        description: 'Interact with the Rightech IoT Cloud API',
        documentationUrl: 'https://github.com/Rightech/n8n-nodes-ric',
        defaults: {
            name: 'Rightech IoT Cloud',
        },
        hints: [],
        usableAsTool: true,
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {name: 'rightechIotCloudApi', required: true}
        ],
        requestDefaults: {
            baseURL: '={{$credentials.ricServer}}',
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
                ],
                default: 'object',
            },
            ...scenarioApiProperties,
            ...objectApiProperties,
        ],
    };
    methods = {
        listSearch: {
            listScenarios: listScenarios,
            listObjects: listObjects,
            listCommands: listCommands,
        }
    }
}
