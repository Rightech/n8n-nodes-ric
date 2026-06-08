import { it } from 'vitest';
import { expectScopeDone, setupNock } from '../../helpers/nock.js';
import { expectRunData, expectRunSuccess, runWorkflowParameters } from '../../helpers/Workflow.js';

it('getMany', async () => {
	const scope = setupNock()
		.get(`/api/v1/events`)
		.query({
			from: 1778630400000,
			to: 1778716800000,
			events: 'object-online,object-offline',
			'events!': 'object-command-req,object-command-res,object-command-err',
		})
		.reply(200, { success: true });
	const run = await runWorkflowParameters(await import('./getMany.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});
