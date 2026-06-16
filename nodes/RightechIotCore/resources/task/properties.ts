import type { INodeProperties } from 'n8n-workflow';
import { ricUuidPropertyMode } from '../../common/properties.js';

export const taskId: INodeProperties = {
	displayName: 'Task',
	name: 'taskId',
	type: 'resourceLocator',
	default: {
		mode: 'list',
		value: '',
	},
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select a task...',
			typeOptions: {
				searchListMethod: 'listTasks',
				searchable: true,
				searchFilterRequired: false,
			},
		},
		ricUuidPropertyMode,
	],
};

export const kind: INodeProperties = {
	displayName: 'Kind Name or ID',
	name: 'kind',
	type: 'options',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	hint: 'Kind controls what the assignee can do with the object',
	default: '',
	typeOptions: {
		loadOptionsMethod: 'loadOptionsOfTaskKinds',
	},
};

export const priority: INodeProperties = {
	displayName: 'Priority',
	name: 'priority',
	type: 'options',
	default: 3,
	options: [
		{
			name: 'High',
			value: 1,
		},
		{
			name: 'Medium',
			value: 2,
		},
		{
			name: 'Low',
			value: 3,
		},
	],
};

export const status: INodeProperties = {
	displayName: 'Status',
	name: 'status',
	type: 'options',
	default: 'created',
	options: [
		{
			name: 'Open',
			value: 'created',
		},
		{
			name: 'Assigned',
			value: 'assigned',
		},
		{
			name: 'In Work',
			value: 'inwork',
		},
		{
			name: 'Completed',
			value: 'closed',
		},
	],
};

export const assigneeId: INodeProperties = {
	displayName: 'Assignee',
	name: 'assigneeId',
	type: 'resourceLocator',
	default: {
		mode: 'list',
		value: '',
	},
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select a user...',
			typeOptions: {
				searchListMethod: 'listUsers',
				searchable: true,
				searchFilterRequired: false,
			},
		},
		ricUuidPropertyMode,
	],
};

export const deadline: INodeProperties = {
	displayName: 'Deadline',
	name: 'deadline',
	type: 'dateTime',
	default: '',
};
