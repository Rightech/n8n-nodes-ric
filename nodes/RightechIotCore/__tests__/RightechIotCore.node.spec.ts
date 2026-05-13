import nock, {Scope} from 'nock';
import {describe, it} from "vitest";
import {expectRunData, expectRunSuccess, runWorkflowParameters} from "./helpers/Workflow.js";
import {expectScopeDone} from "./helpers/expect.js";

nock.emitter.on('no match', (req, options, body) => {
    console.error(`No match for ${req.method} ${req.path} ${JSON.stringify(options.headers)} ${body}`);
});

function setupNock(): Scope {
    return nock('https://dev.rightech.io', {
        allowUnmocked: false,
        reqheaders: {
            Authorization: "Bearer test-token",
        }
    });
}

describe('objects', () => {
    it('should run the object get workflow', async () => {
        const scope = setupNock()
            .get(`/api/v1/objects/69ffff033463098bf7d49699`)
            .reply(200, {mocked: true});
        const run = await runWorkflowParameters(await import('./workflows/object/get.json'));
        expectRunSuccess(run);
        expectScopeDone(scope);
        expectRunData(run, [{mocked: true}]);
    });

    it('should run the object get workflow', async () => {
        const scope = setupNock()
            .post(`/api/v1/objects`, {
                id: /^mqtt-demo_project_01-\w{8}$/,
                name: /^mqtt-demo_project_01-\w{8}$/,
                model: "69fa1b53dc536fdbd136cc65",
            })
            .matchHeader('Content-Type', 'application/json')
            .reply(200, {mocked: true});
        const run = await runWorkflowParameters(await import('./workflows/object/create.default.json'));
        expectRunSuccess(run);
        expectScopeDone(scope);
        expectRunData(run, [{mocked: true}]);
    });

    it('get', async () => {
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
            .reply(200, {mocked: true});
        const run = await runWorkflowParameters(await import('./workflows/object/create.json'));
        expectRunSuccess(run);
        expectScopeDone(scope);
        expectRunData(run, [{mocked: true}]);
    });
});
