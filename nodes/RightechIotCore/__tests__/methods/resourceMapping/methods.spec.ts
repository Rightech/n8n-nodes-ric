import {expect, it} from "vitest";
import {loadOptions} from "../../helpers/Workflow.js";
import {expectScopeDone} from "../../helpers/expect.js";
import {setupNock} from "../../helpers/nock.js";
import {mapTelemetryParams} from "../../../methods/mapTelemetryParams.js";

it('mapTelemetryParams responds well if model not selected', async () => {
    const options = await mapTelemetryParams.call(loadOptions(await import('./mapTelemetryParams.empty.workflow.json')));
    expect(options).toMatchObject({
        fields: [],
        emptyFieldsNotice: expect.any(String)
    });
});

it('mapTelemetryParams responds well if model not selected', async () => {
    const scope = setupNock()
        .get(`/api/v1/objects/69ffff033463098bf7d49699/model`)
        .reply(200, await import('./api.v1.objects.69ffff033463098bf7d49699.model.json'));
    const options = await mapTelemetryParams.call(loadOptions(await import('./mapTelemetryParams.workflow.json')));
    expectScopeDone(scope);
    expect(options).toMatchObject({
        fields: expect.any(Array),
        emptyFieldsNotice: undefined
    });
    expect(options).toMatchSnapshot();
});
