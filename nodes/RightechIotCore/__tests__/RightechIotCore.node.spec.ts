import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { expect, it } from 'vitest';
import { RightechIotCore } from '../RightechIotCore.node.js';
import { handlers } from '../resources/route.js';
import { expectScopeDone, setupNock } from './helpers/nock.js';
import { completeRunData, runWorkflowParameters } from './helpers/Workflow.js';

it('Common error handler returns augmented NodeApiError', async () => {
	const scope = setupNock()
		.get(`/api/v1/objects/ffffffffffffffffffffffff`)
		.reply(404, {
			success: false,
			name: 'RicError',
			code: '404',
			message: 'Not Found',
			tags: ['error_not_found', 'error_objects'],
			codes: ['error_not_found', 'error_objects'],
		})
		.get(`/api/v1/objects/ffffffffffffffffffffffff`)
		.reply(404, {
			success: false,
			name: 'RicError',
			code: '404',
			message: 'Not Found',
			tags: ['error_not_found', 'error_objects'],
			codes: ['error_not_found', 'error_objects'],
		});
	const runFail = await runWorkflowParameters(await import('./object.get.404.fail.workflow.json'));
	expect(runFail.status).toBe('error');
	expect(runFail.data.resultData.error).toMatchObject({
		message: 'The resource you are requesting could not be found',
		messages: ['The resource you are requesting could not be found [item 0]'],
	});

	const runContinue = await runWorkflowParameters(
		await import('./object.get.404.continue.workflow.json'),
	);
	expectScopeDone(scope);
	expect(runContinue.status).toBe('success');
	expect(completeRunData(runContinue)[0]).toMatchObject({
		error: {
			message: 'The resource you are requesting could not be found',
			messages: ['The resource you are requesting could not be found [item 0]'],
		},
	});
});

it('All node properties declare visibility', () => {
	const nodes = new RightechIotCore().description.properties;
	for (const node of nodes) {
		if (node.name !== 'resource') {
			expect(
				node.displayOptions,
				`Parameter ${node.name} is missing display options`,
			).toBeDefined();
		}
	}
});

it('No parameter reuse', () => {
	const nodes = new RightechIotCore().description.properties;
	for (const node of nodes) {
		const show = node.displayOptions?.show ?? {};
		if (node.name === 'operation') {
			expect(
				show,
				`Operation parameter ${node.name} is declared with shared visibility, which is prone to duplication errors`,
			).toMatchObject({
				resource: [expect.any(String)],
			});
		} else if (node.name !== 'resource') {
			expect(
				show,
				`Parameter ${node.name} is declared with shared visibility, which is prone to duplication errors`,
			).toMatchObject({
				resource: [expect.any(String)],
				operation: [expect.any(String)],
			});
		}
	}
});

it('All parameters correspond to defined operations', () => {
	const nodes = new RightechIotCore().description.properties;
	const resources: { [key: string]: string[] } = {};
	for (const node of nodes) {
		if (node.name === 'resource') {
			for (const type of (node.options as INodePropertyOptions[]).map((o) => o.value)) {
				resources[type as string] = [];
			}
		} else if (node.name === 'operation') {
			const byResource = node.displayOptions?.show?.resource?.[0] as string;
			for (const type of (node.options as INodePropertyOptions[]).map((o) => o.value)) {
				expect(
					resources[byResource],
					`Operation ${type} is shown for resource "${byResource}" which is not declared`,
				).toBeDefined();
				resources[byResource]?.push(type as string);
			}
		} else {
			const {
				resource: [byResource],
				operation: [byOperation],
			} = node.displayOptions?.show as { resource: [string]; operation: [string] };
			expect(
				resources[byResource]?.includes(byOperation),
				`Property ${node.name} is shown for operation "${byResource}/${byOperation}" which is not declared`,
			).toBe(true);
		}
	}
});

it('All operations have corresponding handlers', () => {
	// ideally I would want to have operations refer to constants, but then n8n linter won't be able to parse the node correctly
	const nodes = new RightechIotCore().description.properties;
	for (const node of nodes) {
		if (node.name === 'operation') {
			const resource = node.displayOptions?.show?.resource?.[0] as string;
			for (const operation of (node.options as INodePropertyOptions[]).map(
				(o) => o.value as string,
			)) {
				expect(
					handlers[resource][operation]?.name,
					`Cannot find handler for ${resource}/${operation}`,
				).toEqual(operation);
				expect(handlers[resource][operation]).toBeDefined();
			}
		}
	}
});

it('resourceLocator modes refer to included method names', () => {
	const methods = Object.keys(new RightechIotCore().methods.listSearch);
	const modes = new RightechIotCore().description.properties
		.filter((n) => n.type === 'resourceLocator')
		.flatMap((n) => n.modes ?? [])
		.filter((m) => m.type === 'list');
	for (const mode of modes) {
		expect(methods).toContain(mode.typeOptions?.searchListMethod);
	}
});

it('resourceMapper modes refer to included method names', () => {
	const methods = Object.keys(new RightechIotCore().methods.resourceMapping);
	const nodes = new RightechIotCore().description.properties.filter(
		(n) => n.type === 'resourceMapper',
	);
	for (const node of nodes) {
		expect(methods).toContain(node.typeOptions?.resourceMapper?.resourceMapperMethod);
	}
});

it('multiOptions modes refer to included method names or are static', () => {
	const methods = Object.keys(new RightechIotCore().methods.loadOptions);
	const nodes = new RightechIotCore().description.properties.filter(
		(n) => n.type === 'multiOptions',
	);
	for (const node of nodes) {
		if (!node.options?.length) {
			expect(methods).toContain(node.typeOptions?.loadOptionsMethod);
		}
	}
});

it('collection properties cannot use `required` or nest further', () => {
	const nodes = new RightechIotCore().description.properties.filter((n) => n.type === 'collection');
	for (const node of nodes) {
		// collection.options are a subset of INodeProperties[]
		const options = (node.options ?? []) as INodeProperties[];
		for (const option of options) {
			expect(option.type).not.toEqual('collection');
			expect(option.required).toBeUndefined();
		}
	}
});
