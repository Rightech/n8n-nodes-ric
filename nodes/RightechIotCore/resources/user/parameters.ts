import type { INodeProperties } from 'n8n-workflow';
import { ricUuidPropertyMode } from '../../common/properties.js';

export const userId: INodeProperties = {
	displayName: 'User',
	name: 'userId',
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

export const roleId: INodeProperties = {
	displayName: 'Role',
	name: 'roleId',
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
			placeholder: 'Select a role...',
			typeOptions: {
				searchListMethod: 'listRoles',
				searchable: true,
				searchFilterRequired: false,
			},
		},
		ricUuidPropertyMode,
	],
};

export const name: INodeProperties = {
	displayName: 'Name',
	name: 'name',
	type: 'string',
	default: '',
};

export const email: INodeProperties = {
	displayName: 'Email',
	name: 'email',
	placeholder: 'name@email.com',
	type: 'string',
	default: '',
};

export const phone: INodeProperties = {
	displayName: 'Phone',
	name: 'phone',
	type: 'string',
	placeholder: '+14155238886',
	default: '',
};

export const login: INodeProperties = {
	displayName: 'Login',
	name: 'login',
	type: 'string',
	hint: 'Shall only contain latin, digits and special characters',
	default: '',
};

export const password: INodeProperties = {
	displayName: 'Password',
	name: 'password',
	type: 'string',
	hint: 'In default policy shall contain at least one lowercase, uppercase, and digit symbols, and at least 8 symbols total',
	default: '',
	typeOptions: { password: true },
};

export const disabled: INodeProperties = {
	displayName: 'Disabled',
	name: 'disabled',
	type: 'boolean',
	hint: 'Just explicitly disables a user',
	default: false,
};

export const webDisabled: INodeProperties = {
	displayName: 'Disable Web Login',
	name: 'webDisabled',
	type: 'boolean',
	hint: 'Useful for users meant strictly for service apps for example',
	default: false,
};

export const temp: INodeProperties = {
	displayName: 'Is Temporary',
	name: 'temp',
	type: 'boolean',
	hint: 'User will expire after amount of days governed by your platform policy',
	default: false,
};

export const messages: INodeProperties = {
	// todo: unclear usage
	displayName: 'Allow Messages',
	name: 'messages',
	type: 'boolean',
	default: true,
};
