import {expect, it} from "vitest";
import {loadOptions} from "../../helpers/Workflow.js";
import {expectScopeDone} from "../../helpers/expect.js";
import {eventOptions} from "../../../methods/eventOptions.js";
import {setupNock} from "../../helpers/nock.js";
import {eventOptionsOfObjects} from "../../../methods/eventOptionsOfObjects.js";

it('eventOptions keeps defaults on empty options', async () => {
    const scope = setupNock()
        .get(`/api/v1/events/org`)
        .reply(200, await import('./api.v1.events.org.empty.json'));
    const options = await eventOptions.call(loadOptions(await import('./eventOptions.workflow.json')));
    expectScopeDone(scope);
    expect(options).toMatchSnapshot();
});

it('eventOptions returns options for various option types', async () => {
    const scope = setupNock()
        .get(`/api/v1/events/org`)
        .reply(200, await import('./api.v1.events.org.json'));
    const options = await eventOptions.call(loadOptions(await import('./eventOptions.workflow.json')));
    expectScopeDone(scope);
    expect(options).toMatchSnapshot();
});

it('eventOptionsOfObjects keeps defaults on empty options', async () => {
    const scope = setupNock()
        .get(`/api/v1/events/org`)
        .reply(200, await import('./api.v1.events.org.empty.json'));
    const options = await eventOptionsOfObjects.call(loadOptions(await import('./eventOptions.workflow.json')));
    expectScopeDone(scope);
    expect(options).toMatchSnapshot();
});

it('eventOptionsOfObjects returns options for various option types', async () => {
    const scope = setupNock()
        .get(`/api/v1/events/org`)
        .reply(200, await import('./api.v1.events.org.json'));
    const options = await eventOptionsOfObjects.call(loadOptions(await import('./eventOptions.workflow.json')));
    expectScopeDone(scope);
    expect(options).toMatchSnapshot();
});
