import {expect, it} from "vitest";
import {loadOptions} from "../../helpers/Workflow.js";
import {setupNock, expectScopeDone} from "../../helpers/nock.js";
import {mapTelemetryParams} from "../../../methods/mapTelemetryParams.js";
import {mapTableRowQuery} from "../../../methods/mapTableRowQuery.js";
import {mapObjectQueryFromModel} from "../../../methods/mapObjectQueryFromModel.js";
import {mapObjectColumnsFromModel} from "../../../methods/mapObjectColumnsFromModel.js";

it('mapTelemetryParams - not selected', async () => {
    const options = await mapTelemetryParams.call(loadOptions(await import('./mapTelemetryParams.empty.workflow.json')));
    expect(options).toMatchObject({
        fields: [],
        emptyFieldsNotice: expect.any(String)
    });
});

it('mapTelemetryParams', async () => {
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

it('mapTableRowQuery', async () => {
    const scope = setupNock()
        .get(`/api/v1/tables/66d3296025e8200c9d46981d`)
        .reply(200, await import('./api.v1.tables.66d3296025e8200c9d46981d.json'));
    const options = await mapTableRowQuery.call(loadOptions(await import('./mapTableRow.workflow.json')));
    expectScopeDone(scope);
    expect(options).toMatchObject({
        fields: expect.any(Array),
        emptyFieldsNotice: undefined
    });
    expect(options).toMatchSnapshot();
});

it('mapObjectQueryFromModel', async () => {
    const scope = setupNock()
        .get(`/api/v1/models/69fa1b53dc536fdbd136cc65`)
        .reply(200, await import('./api.v1.models.69fa1b53dc536fdbd136cc65.json'));
    const options = await mapObjectQueryFromModel.call(loadOptions(await import('./mapObjectQueryFromModel.workflow.json')));
    expectScopeDone(scope);
    expect(options).toMatchObject({
        fields: expect.any(Array),
        emptyFieldsNotice: undefined
    });
    expect(options).toMatchSnapshot();
});

it('mapObjectColumnsFromModel', async () => {
    const scope = setupNock()
        .get(`/api/v1/models/69fa1b53dc536fdbd136cc65`)
        .reply(200, await import('./api.v1.models.69fa1b53dc536fdbd136cc65.json'))
        .get(`/api/v1/groups/62667930daacc00012016e92`)
        .reply(200, await import('./api.v1.groups.62667930daacc00012016e92.json'));
    const options = await mapObjectColumnsFromModel.call(loadOptions(await import('./mapObjectColumnsFromModel.workflow.json')));
    expectScopeDone(scope);
    expect(options).toMatchObject({
        fields: expect.any(Array),
        emptyFieldsNotice: undefined
    });
    expect(options).toMatchSnapshot();
});
