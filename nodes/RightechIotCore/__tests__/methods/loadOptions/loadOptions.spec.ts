import * as fs from 'node:fs';
import { expect, it } from 'vitest';
import { eventOptions } from '../../../methods/eventOptions.js';
import { eventOptionsOfObjects } from '../../../methods/eventOptionsOfObjects.js';
import { loadOptionsObjects } from '../../../methods/loadOptions/objectOptions.js';
import { loadOptionsOfTaskKinds } from '../../../methods/loadOptionsOfTaskKinds.js';
import { expectScopeDone, setupNock } from '../../helpers/nock.js';
import { loadOptions } from '../../helpers/Workflow.js';

it('eventOptions keeps defaults on empty options', async () => {
	const scope = setupNock()
		.get(`/api/v1/events/org`)
		.reply(200, await import('./api.v1.events.org.empty.json'));
	const options = await eventOptions.call(
		loadOptions(await import('./eventOptions.workflow.json')),
	);
	expectScopeDone(scope);
	expect(options).toMatchSnapshot();
});

it('eventOptions returns options for various option types', async () => {
	const scope = setupNock()
		.get(`/api/v1/events/org`)
		.reply(200, await import('./api.v1.events.org.json'));
	const options = await eventOptions.call(
		loadOptions(await import('./eventOptions.workflow.json')),
	);
	expectScopeDone(scope);
	expect(options).toMatchSnapshot();
});

it('eventOptionsOfObjects keeps defaults on empty options', async () => {
	const scope = setupNock()
		.get(`/api/v1/events/org`)
		.reply(200, await import('./api.v1.events.org.empty.json'));
	const options = await eventOptionsOfObjects.call(
		loadOptions(await import('./eventOptions.workflow.json')),
	);
	expectScopeDone(scope);
	expect(options).toMatchSnapshot();
});

it('eventOptionsOfObjects returns options for various option types', async () => {
	const scope = setupNock()
		.get(`/api/v1/events/org`)
		.reply(200, await import('./api.v1.events.org.json'));
	const options = await eventOptionsOfObjects.call(
		loadOptions(await import('./eventOptions.workflow.json')),
	);
	expectScopeDone(scope);
	expect(options).toMatchSnapshot();
});

it('loadOptionsOfTaskKinds returns options for various task kinds', async () => {
	const scope = setupNock()
		.get(`/api/v1/tasks/kinds?only=_id,name`)
		.reply(200, fs.readFileSync(`${__dirname}/api.v1.tasks.kinds.subset.json`));
	const options = await loadOptionsOfTaskKinds.call(
		loadOptions(await import('./loadOptionsOfTaskKinds.workflow.json')),
	);
	expectScopeDone(scope);
	expect(options).toMatchSnapshot();
});

it('loadOptionsObjects returns objects as ordered options', async () => {
	const scope = setupNock()
		.get(`/api/v1/objects?only=_id,name&sortBy=name&limit=10000`)
		.reply(200, fs.readFileSync(`${__dirname}/api.v1.objects.asOptions.json`));
	const options = await loadOptionsObjects.call(
		loadOptions(await import('./loadOptionsObjects.workflow.json')),
	);
	expectScopeDone(scope);
	const sorted = [...options].sort((a, b) => (b.name > a.name ? -1 : 1));
	expect(options).toEqual(sorted);
	for (const option of options) {
		expect(option).toMatchObject({
			name: expect.stringMatching(/.+/),
			value: expect.stringMatching(/.+/),
		});
	}
});
