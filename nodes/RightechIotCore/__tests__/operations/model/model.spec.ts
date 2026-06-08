import { it } from 'vitest';
import { expectScopeDone, setupNock } from '../../helpers/nock.js';
import { expectRunData, expectRunSuccess, runWorkflowParameters } from '../../helpers/Workflow.js';

it('get', async () => {
	const scope = setupNock()
		.get(`/api/v1/models/69fa1b53dc536fdbd136cc65`)
		.reply(200, { success: true });
	const run = await runWorkflowParameters(await import('./get.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});
