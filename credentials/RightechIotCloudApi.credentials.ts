import type {
	IAuthenticateGeneric, Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RightechIotCloudApi implements ICredentialType {
	name = 'rightechIotCloudApi';
	displayName = 'Rightech IoT Cloud API';
	icon: Icon = 'file:../logo.svg';
	documentationUrl = 'https://rightech.io/en/developers/http/auth';
	properties: INodeProperties[] = [
		{
			displayName: 'Server',
			name: 'ricServer',
			type: 'string',
			required: true,
			default: 'https://dev.rightech.io',
		},
		{
			displayName: 'Access Token',
			name: 'ricAccessToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
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
