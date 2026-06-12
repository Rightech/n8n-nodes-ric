import {
	type IExecuteFunctions,
	type INodeExecutionData,
	WorkflowConfigurationError,
} from 'n8n-workflow';
import type { handlerFn } from '../common/types.js';
import { event } from './event/index.js';
import { model } from './model/index.js';
import { object } from './object/index.js';
import { scenario } from './scenario/index.js';
import { table } from './table/index.js';
import { task } from './task/index.js';
import { user } from './user/index.js';

export const handlers: Record<string, Record<string, handlerFn>> = {
	object,
	model,
	scenario,
	table,
	event,
	user,
	task,
};

export async function route(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const resource = exec.getNodeParameter('resource', 0);
	const operation = exec.getNodeParameter('operation', 0);
	const handler = handlers[resource]?.[operation];
	if (!handler) {
		throw new WorkflowConfigurationError(
			exec.getNode(),
			`Operation ${resource}/${operation} is not defined. This should never happen normally - refresh the page and try to recreate nodes.`,
		);
	}
	return handler(exec, index);
}
