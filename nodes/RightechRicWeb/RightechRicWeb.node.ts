import {NodeConnectionTypes, type INodeType, type INodeTypeDescription} from 'n8n-workflow';
import {logicApiProperties} from "./resources/logic/index.js";
import {objectApiProperties} from "./resources/object/index.js";
import {listAutomatons} from "./methods/listAutomatons.js";
import {listObjects} from "./methods/listObjects.js";
import {listCommands} from "./methods/listCommands.js";

export class RightechRicWeb implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Rightech Ric Web',
        name: 'rightechRicWeb',
        icon: 'file:../../logo.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter.operation + ": " + $parameter.resource}}',
        description: 'Interact with the Rightech Ric Web API',
        documentationUrl: 'TODO:',
        defaults: {
            name: 'Rightech Ric Web',
        },
        hints: [],
        usableAsTool: true,
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {name: 'rightechRicWebApi', required: true}
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
                        description: 'Test test!',
                    },
                    {
                        name: 'Logic',
                        value: 'logic',
                    },
                ],
                default: 'object',
            },
            ...logicApiProperties,
            ...objectApiProperties,
        ],
    };
    methods = {
        listSearch: {
            listAutomatons: listAutomatons,
            listObjects: listObjects,
            listCommands: listCommands,
        }
    }
}
