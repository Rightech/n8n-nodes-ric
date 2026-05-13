import {IRun, IWorkflowBase, IWorkflowExecuteAdditionalData, Workflow, WorkflowParameters} from "n8n-workflow";
import {ExecutionLifecycleHooks, WorkflowExecute} from "n8n-core";
import {CredentialsHelper} from "./CredentialsHelper.js";
import {nodeTypes} from "./NodeTypes.js";
import {expect} from "vitest";

const credentialsHelper = new CredentialsHelper({
    rightechIotCoreApi: {
        ricAccessToken: 'test-token',
        ricServer: 'https://dev.rightech.io',
    },
});

export const runWorkflowParameters = async (workflowParameters: WorkflowParameters): Promise<IRun> => {
    const mode = 'manual';
    const id = 'execution-id';
    const workflow = new Workflow({...workflowParameters, nodeTypes});
    const hooks = new ExecutionLifecycleHooks(mode, id, workflow as IWorkflowBase);
    const manualExecutor = new WorkflowExecute({
        hooks,
        credentialsHelper,
        webhookBaseUrl: 'http://example.com',
        webhookWaitingBaseUrl: 'http://example.com',
        webhookTestBaseUrl: 'http://example.com',
        formWaitingBaseUrl: 'http://example.com',
    } as IWorkflowExecuteAdditionalData, mode);
    return await manualExecutor.run({workflow})
}

export function completeRunData(run: IRun): unknown[] {
    return run.data.resultData.runData[run.data.resultData.lastNodeExecuted][0].data.main[0].map(d => d.json);
}

export function expectRunSuccess(run: IRun): void {
    expect(run.status, run.data.resultData.error?.message).toBe("success");
}

export function expectRunData(run: IRun, data: unknown): void {
    expect(completeRunData(run)).toEqual(data);
}
