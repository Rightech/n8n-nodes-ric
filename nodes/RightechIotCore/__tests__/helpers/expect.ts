import {IRun} from "n8n-workflow";
import {expect} from "vitest";
import {completeRunData} from "./Workflow.js";
import {Scope} from "nock";

export function expectScopeDone(scope: Scope): void {
    scope.isDone() || expect.fail(`API scenario is incomplete: ${scope.pendingMocks()[0]}`);
}

export function expectRunSuccess(run: IRun): void {
    expect(run.status, run.data.resultData.error?.message).toBe("success");
}

export function expectRunData(run: IRun, data: unknown): void {
    expect(completeRunData(run)).toEqual(data);
}
