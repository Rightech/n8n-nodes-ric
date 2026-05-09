import {IExecuteFunctions, INodeExecutionData, WorkflowConfigurationError} from "n8n-workflow";
import {object} from "./object/index.js";
import {model} from "./model/index.js";
import {scenario} from "./scenario/index.js";
import {table} from "./table/index.js";
import {handlerFn} from "../common/types.js";
import {event} from "./event/index.js";

const handlers: Record<string, Record<string, handlerFn>> = {object, model, scenario, table, event}

export async function route(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const resource = exec.getNodeParameter('resource', 0);
    const operation = exec.getNodeParameter('operation', 0);
    const handler = handlers[resource]?.[operation];
    if (!handler) {
        throw new WorkflowConfigurationError(exec.getNode(), `Operation ${resource}/${operation} is not defined. This should never happen normally - refresh the page and try to recreate nodes.`);
    }
    return handler(exec, index);
}
