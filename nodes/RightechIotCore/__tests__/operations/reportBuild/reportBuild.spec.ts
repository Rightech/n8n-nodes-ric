import fs from 'node:fs';
import nock from 'nock';
import { expect, it } from 'vitest';
import { expectScopeDone, setupNock } from '../../helpers/nock.js';
import {
	completeRunData,
	expectRunData,
	expectRunSuccess,
	runWorkflowParameters,
} from '../../helpers/Workflow.js';

it('get', async () => {
	const scope = setupNock()
		.get(`/api/v1/reports/builds?where._id=6a3420eaff5318ed5c0e19ad`)
		.reply(
			200,
			fs.readFileSync(`${__dirname}/api.v1.reports.builds.6a3420eaff5318ed5c0e19ad.json`),
		);
	const run = await runWorkflowParameters(await import('./get.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ _id: '6a3420eaff5318ed5c0e19ad' }]);
});

it('getMany', async () => {
	const scope = setupNock()
		.get(
			`/api/v1/reports/builds?where.report=6a3295425ba3e13b1a7ec140&where.status=failed,completed`,
		)
		.reply(200, fs.readFileSync(`${__dirname}/api.v1.reports.builds.filtered.json`));
	const run = await runWorkflowParameters(await import('./getMany.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	for (const item of completeRunData(run)) {
		expect(item.report).toEqual('6a3295425ba3e13b1a7ec140');
		expect(['failed', 'completed']).toContain(item.status);
	}
});

it('create', async () => {
	const scope = setupNock()
		.post(`/api/v1/reports/6a3295425ba3e13b1a7ec140/build`, {
			period: {
				from: 1780272000000,
				to: 1781827200000,
			},
			objectIds: [
				'626679b5daacc00012016e94',
				'671a028de0236b699a85dcae',
				'66c318ca0f061ecc8fe9b520',
				'6267aa94daacc000120170c3',
			],
		})
		.reply(200, fs.readFileSync(`${__dirname}/api.v1.reports.6a3295425ba3e13b1a7ec140.build.json`));
	const run = await runWorkflowParameters(await import('./create.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});

it('cancel', async () => {
	const scope = setupNock()
		.post(`/api/v1/reports/builds/6a3420eaff5318ed5c0e19ad/cancel`)
		.reply(
			200,
			fs.readFileSync(`${__dirname}/api.v1.reports.builds.6a3420eaff5318ed5c0e19ad.cancel.json`),
		);
	const run = await runWorkflowParameters(await import('./cancel.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
});

it('export', async () => {
	const scope = nock('https://dev.rightech.io', {
		allowUnmocked: false,
		reqheaders: {
			Authorization: 'Bearer test-token',
		},
	})
		.get(`/api/v1/reports/builds/6a3420eaff5318ed5c0e19ad/export?format=json`)
		.matchHeader('Accept', 'application/json, text/plain, */*')
		.reply(
			200,
			fs.readFileSync(`${__dirname}/2026-06-18_16-50-41_lev-sample-report_2objects.json`),
			{
				'Content-Type': 'application/json',
				'Content-Disposition':
					"attachment; filename*=UTF8''2026-06-18_16-50-41_lev-sample-report_2objects.json",
			},
		);
	const run = await runWorkflowParameters(await import('./export.workflow.json'));
	expectRunSuccess(run);
	expectScopeDone(scope);
	expectRunData(run, [{ success: true }]);
	const lastNode = run.data.resultData.lastNodeExecuted ?? '';
	const bin = run.data.resultData.runData[lastNode][0].data?.main[0]?.[0].binary;
	expect(bin).toMatchObject({
		report: {
			mimeType: 'application/json',
			fileType: 'json',
			fileName: '2026-06-18_16-50-41_lev-sample-report_2objects.json',
			fileSize: '1.63 kB',
			fileExtension: 'json',
		},
	});
});
