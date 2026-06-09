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
			`/api/v1/tasks?where.kind=62ac50cc38f7500012f0dafb,62ac513938f7500012f0dafd&where.assignee=62d8e2a7ce20cb001187b87b&where.status=created,assigned,inwork`,
		)
		.reply(200, { success: true });
	const run = await runWorkflowParameters(await import('./getMany.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});
