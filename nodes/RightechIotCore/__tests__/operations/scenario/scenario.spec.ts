import { it } from 'vitest';
import { expectScopeDone, setupNock } from '../../helpers/nock.js';
import { expectRunData, expectRunSuccess, runWorkflowParameters } from '../../helpers/Workflow.js';

it('start', async () => {
	const scope = setupNock()
		.post(`/api/v1/objects/69ffff033463098bf7d49699/automatons/69f826529f5e85b5c3ea7223/start`)
		.matchHeader('Content-Type', 'application/json')
		.reply(200, { success: true });
	const run = await runWorkflowParameters(await import('./start.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});

it('stop', async () => {
	const scope = setupNock()
		.post(`/api/v1/objects/69ffff033463098bf7d49699/automatons/69f826529f5e85b5c3ea7223/stop`)
		.matchHeader('Content-Type', 'application/json')
		.reply(200, { success: true });
	const run = await runWorkflowParameters(await import('./stop.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});
