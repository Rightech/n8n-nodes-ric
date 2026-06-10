import { expect, it } from 'vitest';
import { listCommands } from '../../../methods/listCommands.js';
import { listModels } from '../../../methods/listModels.js';
import { listObjects } from '../../../methods/listObjects.js';
import { listRows } from '../../../methods/listRows.js';
import { listScenarios } from '../../../methods/listScenarios.js';
import { listTables } from '../../../methods/listTables.js';
import { listTaskKinds } from '../../../methods/listTaskKinds.js';
import { listTasks } from '../../../methods/listTasks.js';
import { listUsers } from '../../../methods/listUsers.js';
import { expectScopeDone, setupNock } from '../../helpers/nock.js';
import { loadOptions } from '../../helpers/Workflow.js';

it('listCommands default', async () => {
	const options = await listCommands.call(
		loadOptions(await import('./listCommands.default.workflow.json')),
	);
	expect(options).toEqual({ results: [] });
});

it('listCommands empty', async () => {
	const scope = setupNock()
		.get(`/api/v1/objects/69ffff033463098bf7d49699/model?only=model`)
		.reply(200, await import('./api.v1.objects.69ffff033463098bf7d49699.model.json'));
	const options = await listCommands.call(
		loadOptions(await import('./listCommands.workflow.json')),
	);
	expectScopeDone(scope);
	expect(options).toEqual({ results: [] });
});

it('listCommands all', async () => {
	const scope = setupNock()
		.get(`/api/v1/objects/69ffff033463098bf7d49699/model?only=model`)
		.reply(200, await import('./api.v1.objects.69f1e84c62c70f5e7252625c.model.json'));
	const options = await listCommands.call(
		loadOptions(await import('./listCommands.workflow.json')),
	);
	expectScopeDone(scope);
	expect(options).toEqual({
		results: [
			{
				name: "Turn-on LED",
				value: "led-on",
			},
			{
				name: "Turn-off LED",
				value: "led-off",
			},
		],
	});
});

it('listCommands filtered', async () => {
	const scope = setupNock()
		.get(`/api/v1/objects/69ffff033463098bf7d49699/model?only=model`)
		.reply(200, await import('./api.v1.objects.69f1e84c62c70f5e7252625c.model.json'));
	const options = await listCommands.call(
		loadOptions(await import('./listCommands.workflow.json')),
		'off'
	);
	expectScopeDone(scope);
	expect(options).toEqual({
		results: [
			{
				name: "Turn-off LED",
				value: "led-off",
			},
		],
	});
});

it('listModels', async () => {
	const scope = setupNock()
		.get(`/api/v1/models?limit=1000&only=_id,name,base`)
		.reply(200, (await import('./api.v1.models.subset.json')).default);
	const options = await listModels.call(loadOptions(await import('./listModels.workflow.json')));
	expectScopeDone(scope);
	expect(options).toMatchSnapshot();
});

it('listObjects', async () => {
	const scope = setupNock()
		.get(`/api/v1/objects?limit=1000&only=_id,id,name`)
		.reply(200, (await import('./api.v1.objects.subset.json')).default);
	const options = await listObjects.call(loadOptions(await import('./listObjects.workflow.json')));
	expectScopeDone(scope);
	expect(options).toMatchSnapshot();
});

it('listRows', async () => {
	const scope = setupNock()
		.get(`/api/v1/tables/66d3296025e8200c9d46981d/rows`)
		.reply(200, (await import('./api.v1.tables.66d3296025e8200c9d46981d.rows.json')).default);
	const options = await listRows.call(loadOptions(await import('./listRows.workflow.json')));
	expectScopeDone(scope);
	expect(options).toMatchSnapshot();
});

it('listScenarios', async () => {
	const scope = setupNock()
		.get(`/api/v1/automatons`)
		.reply(200, (await import('./api.v1.automatons.json')).default);
	const options = await listScenarios.call(
		loadOptions(await import('./listScenarios.workflow.json')),
	);
	expectScopeDone(scope);
	expect(options).toMatchSnapshot();
});

it('listTables', async () => {
	const scope = setupNock()
		.get(`/api/v1/tables`)
		.reply(200, (await import('./api.v1.tables.json')).default);
	const options = await listTables.call(loadOptions(await import('./listModels.workflow.json')));
	expectScopeDone(scope);
	expect(options).toMatchSnapshot();
});

it('listUsers - default state', async () => {
	const scope = setupNock()
		.get(`/api/v1/users?limit=1000&only=_id,name`)
		.reply(200, (await import('./api.v1.users.search.json')).default);
	const options = await listUsers.call(loadOptions(await import('./listUsers.workflow.json')));
	expectScopeDone(scope);
	expect(options).toMatchSnapshot();
});

it('listUsers - by text', async () => {
	const scope = setupNock()
		.get(`/api/v1/users?limit=1000&only=_id,name&search=rightech`)
		.reply(200, (await import('./api.v1.users.search.json')).default);
	const options = await listUsers.call(
		loadOptions(await import('./listUsers.workflow.json')),
		'rightech',
	);
	expectScopeDone(scope);
	expect(options).toMatchSnapshot();
});

it('listTaskKinds default state', async () => {
	const scope = setupNock()
		.get(`/api/v1/tasks/kinds?only=_id,name`)
		.reply(200, (await import('./api.v1.tasks.kinds.subset.json')).default);
	const options = await listTaskKinds.call(
		loadOptions(await import('./listObjects.workflow.json')),
	);
	expectScopeDone(scope);
	expect(options.paginationToken).toBeUndefined();
	expect(options.results).toHaveLength(10);
	options.results.forEach((item) => {
		expect(item).toMatchObject({
			name: expect.any(String),
			value: expect.any(String),
		});
	});
});

it('listTaskKinds search by name', async () => {
	const scope = setupNock()
		.get(`/api/v1/tasks/kinds?only=_id,name`)
		.reply(200, (await import('./api.v1.tasks.kinds.subset.json')).default);
	const options = await listTaskKinds.call(
		loadOptions(await import('./listObjects.workflow.json')),
		'REPAIR',
	);
	expectScopeDone(scope);
	expect(options.paginationToken).toBeUndefined();
	expect(options.results).toHaveLength(2);
	options.results.forEach((item) => {
		expect(item.name).toMatch(/repair/i);
	});
});

it('listTasks search by name', async () => {
	const scope = setupNock()
		.get(`/api/v1/tasks?only=_id,name&where.archived=false`)
		.reply(200, (await import('./api.v1.tasks.subset.json')).default);
	const options = await listTasks.call(loadOptions(await import('./listObjects.workflow.json')));
	expectScopeDone(scope);
	expect(options.paginationToken).toBeUndefined();
	expect(options).toMatchSnapshot();
});
