import type {
	IAuthenticateGeneric, Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RightechIotCloudApi implements ICredentialType {
	name = 'rightechIotCloudApi';
	displayName = 'Rightech IoT Core API';
	icon: Icon = 'file:../logo.svg';
	documentationUrl = 'https://github.com/Rightech/n8n-nodes-ric#credentials';
	properties: INodeProperties[] = [
		{
			displayName: 'Server',
			name: 'ricServer',
			type: 'string',
			required: true,
			default: 'https://dev.rightech.io',
			placeholder: 'https://dev.rightech.io',
			hint: 'This must point at the base URL of your RIC instance - do not include `/api` or other prefixes. When using n8n cloud with on-premise RIC, make sure you have a public domain with HTTPS set up.',
		},
		{
			displayName: 'Access Token',
			name: 'ricAccessToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			placeholder: 'a long string e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...',
			hint: 'Access token is a JWT token that you can issue in the RIC web UI - refer to documentation at https://github.com/Rightech/n8n-nodes-ric#credentials.',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.ricAccessToken}}',
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.ricServer}}',
			url: '/',
		},
	};
}
