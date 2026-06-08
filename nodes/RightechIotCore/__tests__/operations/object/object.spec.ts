import {it} from "vitest";
import {expectRunData, expectRunSuccess, runWorkflowParameters} from "../../helpers/Workflow.js";
import {setupNock, expectScopeDone} from "../../helpers/nock.js";

it('get', async () => {
    const scope = setupNock()
        .get(`/api/v1/objects/69ffff033463098bf7d49699`)
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./get.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});

it('getMany - by model', async () => {
    const scope = setupNock()
        .get(`/api/v1/objects`)
        .query({
            "where.model": "69fa1b53dc536fdbd136cc65",
            "where.status": "status_a",
            "where.config.settings.number": 1,
            "where.config.params.flag": true,
            "where.config.configs.string": "\"1234\"",
            "where.config.auth.username": "null",
        })
        .reply(200, [{_id: "1"}, {_id: "2"}]);
    const run = await runWorkflowParameters(await import('./getMany.byModel.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{_id: "1"}, {_id: "2"}]);
});

it('getMany - without model', async () => {
    const scope = setupNock()
        .get(`/api/v1/objects`)
        .query({
            "where_type": "ric-bot:mqtt",
            "limit": 50,
            "where.config.position.display": "null",
            "only": "_id,type",
        })
        .reply(200, [{_id: "1"}, {_id: "2"}]);
    const run = await runWorkflowParameters(await import('./getMany.noModel.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{_id: "1"}, {_id: "2"}]);
});

it('create - defaults', async () => {
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

it('create', async () => {
    const scope = setupNock()
        .post(`/api/v1/objects`, {
            id: /^mqtt-demo_project_01-\w{8}$/,
            name: /^custom-name-demo_project_01-\w{8}$/,
            model: "69fa1b53dc536fdbd136cc65",
            status: "status_a",
            config: {
                configs: {"string-dropdown": "on"},
                settings: {number: 1}
            }
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./create.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});

it('update', async () => {
    const scope = setupNock()
        .patch(`/api/v1/objects/69ffff033463098bf7d49699`, {
            name: "n8n-test-model-object-1",
            status: "status_b",
            config: {
                configs: {
                    "string-dropdown": "off",
                    table: "66d3296625e8200c9d46981e"
                }
            }
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./update.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});

it('getEvents', async () => {
    const scope = setupNock()
        .get(`/api/v1/objects/69ffff033463098bf7d49699/events`)
        .query({
            from: new Date("2026-05-01T00:00:00").getTime(),
            to: new Date("2026-05-14T00:00:00").getTime(),
        })
        .reply(200, [
            {_id: "0", event: "object-create"},
            {_id: "1", event: "object-online"},
            {_id: "2", event: "object-offline"},
            {_id: "3", event: "object-online"},
            {_id: "4", event: "object-offline"},
        ]);
    const run = await runWorkflowParameters(await import('./getEvents.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [
        {_id: "1", event: "object-online"},
        {_id: "3", event: "object-online"},
    ]);
});

it('getHistory', async () => {
    const scope = setupNock()
        .get(`/api/v1/objects/69ffff033463098bf7d49699/packets`)
        .query({
            from: "2026-05-01T00:00:00",
            to: "2026-05-14T00:00:00",
            limit: 10,
        })
        .reply(200, [{_id: "1"}, {_id: "2"}]);
    const run = await runWorkflowParameters(await import('./getHistory.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{_id: "1"}, {_id: "2"}]);
});

it('sendCommand', async () => {
    const scope = setupNock()
        .post(`/api/v1/objects/69f1e84c62c70f5e7252625c/commands/led-on`, {
            sample: 1
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./sendCommand.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});

it('sendCommand by id', async () => {
    const scope = setupNock()
        .post(`/api/v1/objects/626679b5daacc00012016e94/commands/3jtai-2vp9w`, "")
        .matchHeader('Content-Type', 'application/json')
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./sendCommand.ById.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});

it('sendTelemetry - manual mapping', async () => {
    const scope = setupNock()
        .post(`/api/v1/objects/69ffff033463098bf7d49699/packets`, {
            online: true,
            "arg-string": "zxc",
            "arg-list-number": [1, 2, 3]
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./sendTelemetry.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});

it('sendTelemetry - automapping', async () => {
    const scope = setupNock()
        .get(`/api/v1/objects/69ffff033463098bf7d49699/model`)
        .reply(200, await import("./api.v1.objects.69ffff033463098bf7d49699.model.json"))
        .post(`/api/v1/objects/69ffff033463098bf7d49699/packets`, {
            online: true,
            "arg-number": 123,
            "arg-string": "123",
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, {success: true});
    const run = await runWorkflowParameters(await import('./sendTelemetry.automap.workflow.json'));
    expectRunSuccess(run);
    expectScopeDone(scope);
    expectRunData(run, [{success: true}]);
});
