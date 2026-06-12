import { ExecutionLifecycleHooks, LoadOptionsContext, WorkflowExecute } from 'n8n-core';
import {
	type ILoadOptionsFunctions,
	type INode,
	type IRun,
	type IWorkflowBase,
	type IWorkflowExecuteAdditionalData,
	Workflow,
	type WorkflowParameters,
} from 'n8n-workflow';
import { expect } from 'vitest';
import { CredentialsHelper } from './CredentialsHelper.js';
import { nodeTypes } from './NodeTypes.js';

const credentialsHelper = new CredentialsHelper({
	rightechIotCoreApi: {
		ricAccessToken: 'test-token',
		ricServer: 'https://dev.rightech.io',
	},
});

export const loadOptions = (workflowParameters: object): ILoadOptionsFunctions => {
	const mode = 'manual';
	const id = 'execution-id';
	const workflow = new Workflow({ ...(workflowParameters as WorkflowParameters), nodeTypes });
	const hooks = new ExecutionLifecycleHooks(mode, id, workflow as unknown as IWorkflowBase);
	const sutNode = Object.values(workflow.nodes).filter(
		(n) => n.type === 'CUSTOM.rightechIotCore',
	)[0] as INode;
	return new LoadOptionsContext(
		workflow,
		sutNode,
		{
			hooks,
			credentialsHelper,
			webhookBaseUrl: 'http://example.com',
			webhookWaitingBaseUrl: 'http://example.com',
			webhookTestBaseUrl: 'http://example.com',
			formWaitingBaseUrl: 'http://example.com',
			currentNodeParameters: sutNode?.parameters,
		} as unknown as IWorkflowExecuteAdditionalData,
		'',
	);
};

export const runWorkflowParameters = async (workflowParameters: object): Promise<IRun> => {
	const mode = 'manual';
	const id = 'execution-id';
	const workflow = new Workflow({ ...(workflowParameters as WorkflowParameters), nodeTypes });
	const hooks = new ExecutionLifecycleHooks(mode, id, workflow as unknown as IWorkflowBase);
	const manualExecutor = new WorkflowExecute(
		{
			hooks,
			credentialsHelper,
			webhookBaseUrl: 'http://example.com',
			webhookWaitingBaseUrl: 'http://example.com',
			webhookTestBaseUrl: 'http://example.com',
			formWaitingBaseUrl: 'http://example.com',
		} as unknown as IWorkflowExecuteAdditionalData,
		mode,
	);
	return await manualExecutor.run({ workflow });
};

export function completeRunData(run: IRun): unknown[] {
	const lastNode = run.data.resultData.lastNodeExecuted ?? '';
	return (run.data.resultData.runData[lastNode][0].data?.main ?? [])[0]?.map((d) => d.json) ?? [];
}

export function expectRunSuccess(run: IRun): void {
	expect(run.status, run.data.resultData.error?.message).toBe('success');
}

export function expectRunData(run: IRun, data: object | unknown[]): void {
	expect(completeRunData(run)).toMatchObject(data);
}
