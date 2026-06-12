import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { httpCall } from '../../common/util.js';
import {
	disabled,
	email,
	login,
	messages,
	name,
	password,
	phone,
	roleId,
	temp,
	webDisabled,
} from './parameters.js';

const displayOptions = {
	show: {
		resource: ['user'],
		operation: ['create'],
	},
};

export const userCreateProperties: INodeProperties[] = [
	// todo: shall consider `api` ?
	{
		...roleId,
		required: true,
		displayOptions,
	},
	{
		...name,
		required: true,
		displayOptions,
	},
	{
		...email,
		required: true,
		displayOptions,
	},
	{
		...login,
		required: true,
		displayOptions,
	},
	{
		...password,
		required: true,
		displayOptions,
	},
	{
		displayName: 'Optional Fields',
		name: 'fields',
		type: 'collection',
		default: {},
		options: [phone, disabled, webDisabled, temp, messages],
		displayOptions,
	},
];

export async function create(
	exec: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const role = exec.getNodeParameter('roleId.value', index) as string;
	const name = exec.getNodeParameter('name', index) as string;
	const email = exec.getNodeParameter('email', index) as string;
	const login = exec.getNodeParameter('login', index) as string;
	const password = exec.getNodeParameter('password', index) as string;
	const fields = exec.getNodeParameter('fields', index) as {
		phone?: string;
		disabled?: boolean;
		webDisabled?: boolean;
		temp?: boolean;
		messages?: boolean;
	};
	const body: { [key: string]: unknown } = {
		role,
		name,
		email,
		login,
		password,
		...fields,
	};
	const responseData = (await httpCall(exec, {
		method: 'POST',
		url: `/api/v1/users`,
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
