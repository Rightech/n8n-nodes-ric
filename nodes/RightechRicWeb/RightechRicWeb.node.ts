import {NodeConnectionTypes, type INodeType, type INodeTypeDescription} from 'n8n-workflow';
import {logicApiProperties} from "./resources/logic/index.js";
import {objectsApiProperties} from "./resources/objects/index.js";
import {listAutomatons} from "./methods/listAutomatons.js";

export class RightechRicWeb implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Rightech Ric Web',
        name: 'RightechRicWeb',
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
            {name: 'RightechRicWebApi', required: true}
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
                        name: 'Objects',
                        value: 'objects',
                    },
                    {
                        name: 'Logic',
                        value: 'logic',
                    },
                ],
                default: 'objects',
            },
            ...logicApiProperties,
            ...objectsApiProperties,
        ],
    };
    methods = {
        listSearch: {
            listAutomatons,
        }
    }
}
