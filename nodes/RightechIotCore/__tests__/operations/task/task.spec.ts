import * as fs from 'node:fs';
import { it } from 'vitest';
import { expectScopeDone, setupNock } from '../../helpers/nock.js';
import { expectRunData, expectRunSuccess, runWorkflowParameters } from '../../helpers/Workflow.js';

it('get', async () => {
	const scope = setupNock()
		.get(`/api/v1/tasks/66acd3973d4cc9e17264483b`)
		.reply(200, { success: true });
	const run = await runWorkflowParameters(await import('./get.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});

it('getMany', async () => {
	const scope = setupNock()
		.get(
			`/api/v1/tasks?where.kind=62ac50cc38f7500012f0dafb,62ac513938f7500012f0dafd&where.assignee=62d8e2a7ce20cb001187b87b&where.status=created,assigned,inwork&where.archived=false`,
		)
		.reply(200, { success: true });
	const run = await runWorkflowParameters(await import('./getMany.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});

it('create', async () => {
	const scope = setupNock()
		.post(`/api/v1/tasks`, {
			status: 'assigned',
			kind: '62ac50cc38f7500012f0dafb',
			priority: 2,
			name: 'Test task from n8n',
			description: 'test',
			object: '626679b5daacc00012016e94',
			assignee: '62d8e2a7ce20cb001187b87b',
			deadlines: { inwork: 1781136000000 },
		})
		.reply(200, { success: true });
	const run = await runWorkflowParameters(await import('./create.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});

it('update', async () => {
	const scope = setupNock()
		.get(`/api/v1/tasks/6a29c910688fc7f1a0cc4583`)
		.reply(200, fs.readFileSync(`${__dirname}/api.v1.tasks.get.6a29c910688fc7f1a0cc4583.json`))
		.patch(`/api/v1/tasks/6a29c910688fc7f1a0cc4583`, {
			priority: 3,
			name: 'Test task from n8n - updated',
			description: 'changed',
			assignee: '62d8ead5ce20cb001187b8c2',
			deadlines: { inwork: null },
		})
		.reply(200, { success: true });
	const run = await runWorkflowParameters(await import('./update.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});
