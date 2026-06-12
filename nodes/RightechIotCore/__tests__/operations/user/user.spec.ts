import * as fs from 'node:fs';
import { it } from 'vitest';
import { expectScopeDone, setupNock } from '../../helpers/nock.js';
import { expectRunData, expectRunSuccess, runWorkflowParameters } from '../../helpers/Workflow.js';

it('get', async () => {
	const scope = setupNock()
		.get(`/api/v1/users/62d8ead5ce20cb001187b8c2`)
		.reply(200, { success: true });
	const run = await runWorkflowParameters(await import('./get.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});

it('getMany', async () => {
	const scope = setupNock()
		.get(`/api/v1/users?search=rightech&limit=5`)
		.reply(200, [{ _id: '1' }, { _id: '2' }]);
	const run = await runWorkflowParameters(await import('./getMany.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ _id: '1' }, { _id: '2' }]);
});

it('create', async () => {
	const scope = setupNock()
		.post(`/api/v1/users`, {
			role: '5c5061c11af9ac1100e8d55f',
			name: 'ZXCZXCZXC',
			email: 'zxczxczxc@gmail.com',
			login: 'zxczxczxc@gmail.com',
			password: 'zxczxcZXC123',
			temp: true,
		})
		.reply(200, fs.readFileSync(`${__dirname}/api.v1.users.create.json`));
	const run = await runWorkflowParameters(await import('./create.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});

it('update', async () => {
	const scope = setupNock()
		.get(`/api/v1/users/6a2c8659e7f163fb71bd0f2b`)
		.reply(200, fs.readFileSync(`${__dirname}/api.v1.users.6a2c8659e7f163fb71bd0f2b.json`))
		.patch(`/api/v1/users/6a2c8659e7f163fb71bd0f2b`, {
			phone: '+1234567890',
			temp: false,
		})
		.reply(200, fs.readFileSync(`${__dirname}/api.v1.users.update.json`));
	const run = await runWorkflowParameters(await import('./update.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});
