import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import type { INodeParameterResourceLocator } from 'n8n-workflow/dist/esm/interfaces.js';
import { httpCall } from '../../common/util.js';
import {
	disabled,
	login,
	messages,
	name,
	password,
	phone,
	roleId,
	temp,
	userId,
	webDisabled,
} from './parameters.js';

const displayOptions = {
	show: {
		resource: ['user'],
		operation: ['update'],
	},
};

export const userUpdateProperties: INodeProperties[] = [
	{
		...userId,
		required: true,
		displayOptions,
	},
	{
		displayName: 'Fields to Set',
		name: 'fields',
		type: 'collection',
		default: {},
		options: [roleId, name, phone, login, password, disabled, webDisabled, temp, messages],
		displayOptions,
	},
];

export async function update(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = exec.getNodeParameter('userId.value', index) as string;
	const fields = exec.getNodeParameter('fields', index) as {
		roleId?: INodeParameterResourceLocator;
		name?: string;
		phone?: string;
		login?: string;
		password?: string;
		disabled?: boolean;
		webDisabled?: boolean;
		temp?: boolean;
		messages?: boolean;
	};
	const body: { [key: string]: unknown } = {
		role: fields.roleId?.value || undefined,
		name: fields.name || undefined,
		phone: fields.phone,
		login: fields.login || undefined,
		password: fields.password || undefined,
		disabled: fields.disabled,
		webDisabled: fields.webDisabled,
		temp: fields.temp,
		messages: fields.messages,
	};
	const responseData = (await httpCall(exec, {
		method: 'PATCH',
		url: `/api/v1/users/${userId}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		json: true,
		body,
	})) as IDataObject;
	return [
		...exec.helpers.constructExecutionMetaData(exec.helpers.returnJsonArray(responseData), {
			itemData: { item: index },
		}),
	];
}
