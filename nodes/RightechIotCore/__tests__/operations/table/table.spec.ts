import {it} from "vitest";
import {expectScopeDone, setupNock} from "../../helpers/nock.js";
import {expectRunData, expectRunSuccess, runWorkflowParameters} from "../../helpers/Workflow.js";

it('get', async () => {
    const scope = setupNock()
        .get(`/api/v1/tables/66d3296025e8200c9d46981d`)
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./get.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});

it('getRow', async () => {
    const scope = setupNock()
        .get(`/api/v1/tables/66d3296025e8200c9d46981d/rows/66d3296625e8200c9d46981e`)
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./getRow.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});

it('getRows', async () => {
    const scope = setupNock()
        .get(`/api/v1/tables/66d3296025e8200c9d46981d/rows`)
        .query({
            from: "2022-05-01T00:00:00",
            "where.data.name": "Иван Иванов",
            "where.data.working": "false",
        })
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./getRows.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});
