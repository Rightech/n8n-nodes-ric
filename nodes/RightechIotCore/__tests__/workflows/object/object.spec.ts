import {it} from "vitest";
import {expectRunData, expectRunSuccess, runWorkflowParameters} from "../../helpers/Workflow.js";
import {expectScopeDone} from "../../helpers/expect.js";
import {setupNock} from "../../helpers/nock.js";

it('cat get an object', async () => {
    const scope = setupNock()
        .get(`/api/v1/objects/69ffff033463098bf7d49699`)
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./get.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});

it('can create an object with defaults', async () => {
    const scope = setupNock()
        .post(`/api/v1/objects`, {
            id: /^mqtt-demo_project_01-\w{8}$/,
            name: /^mqtt-demo_project_01-\w{8}$/,
            model: "69fa1b53dc536fdbd136cc65",
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./create.default.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});

it('can create an object with custom params', async () => {
    const scope = setupNock()
        .post(`/api/v1/objects`, {
            id: /^mqtt-demo_project_01-\w{8}$/,
            name: /^custom-name-demo_project_01-\w{8}$/,
            model: "69fa1b53dc536fdbd136cc65",
            status: "status_a",
            config: {
                configs: {"string-dropdown":"on"},
                settings: {number:1}
            }
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./create.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});