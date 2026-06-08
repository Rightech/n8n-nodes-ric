import { it } from 'vitest';
import { expectScopeDone, setupNock } from '../../helpers/nock.js';
import { expectRunData, expectRunSuccess, runWorkflowParameters } from '../../helpers/Workflow.js';

it('get', async () => {
	const scope = setupNock()
		.get(`/api/v1/users/62d8ead5ce20cb001187b8c2?only=_id,role,group,name,login,email,phone`)
		.reply(200, { success: true });
	const run = await runWorkflowParameters(await import('./get.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});

it('getMany', async () => {
	const scope = setupNock()
		.get(`/api/v1/users?only=_id,role,group,name,login,email,phone&search=rightech&limit=5`)
		.reply(200, [{ _id: '1' }, { _id: '2' }]);
	const run = await runWorkflowParameters(await import('./getMany.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ _id: '1' }, { _id: '2' }]);
});
