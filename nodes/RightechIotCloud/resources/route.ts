import {IExecuteFunctions, INodeExecutionData} from "n8n-workflow";
import {object} from "./object/index.js";
import {scenario} from "./scenario/index.js";
import {table} from "./table/index.js";
import {handlerFn} from "../common/types.js";

const handlers: Record<string, Record<string, handlerFn>> = {object, scenario, table}

export async function route(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const resource = exec.getNodeParameter('resource', 0);
    const operation = exec.getNodeParameter('operation', 0);
    return handlers[resource][operation](exec, index);
}
