import type {
	IAuthenticateGeneric, Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RightechRicWebApi implements ICredentialType {
	name = 'RightechRicWebApi';
	displayName = 'Rightech Ric Web API';
	icon: Icon = 'file:../logo.svg';
	documentationUrl = 'TODO: publicly available doc about the node';
	properties: INodeProperties[] = [
		{
			displayName: 'Server',
			name: 'ricServer',
			type: 'string',
			required: true,
			default: 'https://dev.rightech.io/api/v1',
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
