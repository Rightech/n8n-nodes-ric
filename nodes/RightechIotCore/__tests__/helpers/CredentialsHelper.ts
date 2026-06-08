import {
	type ICredentialDataDecryptedObject,
	type ICredentials,
	type ICredentialsExpressionResolveValues,
	ICredentialsHelper,
	type ICredentialType,
	type ICredentialTypes,
	type IExecuteData,
	type IHttpRequestHelper,
	type IHttpRequestOptions,
	type INode,
	type INodeCredentialsDetails,
	type INodeProperties,
	type IRequestOptionsSimplified,
	type IWorkflowDataProxyAdditionalKeys,
	type IWorkflowExecuteAdditionalData,
	isExpression,
	type Workflow,
	type WorkflowExecuteMode,
} from 'n8n-workflow';
import { RightechIotCoreApi } from '../../../../credentials/RightechIotCoreApi.credentials.js';

export class CredentialTypes implements ICredentialTypes {
	recognizes(type: string) {
		return type === 'rightechIotCoreApi';
	}

	getByName(credentialType: string): ICredentialType {
		if (credentialType === 'rightechIotCoreApi') {
			return new RightechIotCoreApi();
		}
		throw new Error(`Unknown credential type ${credentialType}`);
	}

	getSupportedNodes(type: string): string[] {
		if (type === 'rightechIotCoreApi') {
			return ['@rightech/n8n-nodes-ric.rightechIotCore', 'CUSTOM.rightechIotCore'];
		}
		return [];
	}

	/**
	 * Returns all parent types of the given credential type
	 */
	getParentTypes(_typeName: string): string[] {
		return [];
	}
}

export class CredentialsHelper extends ICredentialsHelper {
	private credentials: Record<string, ICredentialDataDecryptedObject>;
	private credentialTypes: ICredentialTypes;

	constructor(credentials: Record<string, ICredentialDataDecryptedObject>) {
		super();
		this.credentials = credentials;
		this.credentialTypes = new CredentialTypes();
	}

	getParentTypes(_name: string): string[] {
		return [];
	}

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		typeName: string,
		incomingRequestOptions: IHttpRequestOptions | IRequestOptionsSimplified,
		workflow: Workflow,
		node: INode,
	): Promise<IHttpRequestOptions> {
		const requestOptions = incomingRequestOptions;
		const credentialType = this.credentialTypes.getByName(typeName);

		if (credentialType.authenticate) {
			if (typeof credentialType.authenticate === 'function') {
				// Special authentication function is defined

				return await credentialType.authenticate(
					credentials,
					requestOptions as IHttpRequestOptions,
				);
			}

			if (typeof credentialType.authenticate === 'object') {
				// Predefined authentication method

				let keyResolved: string;
				let valueResolved: string;
				const { authenticate } = credentialType;
				if (requestOptions.headers === undefined) {
					requestOptions.headers = {};
				}

				if (authenticate.type === 'generic') {
					Object.entries(authenticate.properties).forEach(([outerKey, outerValue]) => {
						Object.entries(outerValue).forEach(([key, value]) => {
							keyResolved = this.resolveValue(key, { $credentials: credentials }, workflow, node);

							valueResolved = this.resolveValue(
								value as string,
								{ $credentials: credentials },
								workflow,
								node,
							);

							// @ts-expect-error
							if (!requestOptions[outerKey]) {
								// @ts-expect-error
								requestOptions[outerKey] = {};
							}
							// @ts-expect-error
							requestOptions[outerKey][keyResolved] = valueResolved;
						});
					});
				}
			}
		}
		return requestOptions as IHttpRequestOptions;
	}

	async preAuthentication(
		_helpers: IHttpRequestHelper,
		_credentials: ICredentialDataDecryptedObject,
		_typeName: string,
		_node: INode,
		_credentialsExpired: boolean,
	): Promise<ICredentialDataDecryptedObject | undefined> {
		return undefined;
	}

	/**
	 * Returns the credentials instance
	 */
	async getCredentials(
		_nodeCredential: INodeCredentialsDetails,
		_type: string,
	): Promise<ICredentials> {
		throw new Error('Not implemented');
	}

	runPreAuthentication(
		_helpers: IHttpRequestHelper,
		_credentials: ICredentialDataDecryptedObject,
		_typeName: string,
	): Promise<ICredentialDataDecryptedObject | undefined> {
		throw new Error('Not implemented');
	}

	updateCredentialsOauthTokenData(
		_nodeCredentials: INodeCredentialsDetails,
		_type: string,
		_data: ICredentialDataDecryptedObject,
		_additionalData: IWorkflowExecuteAdditionalData,
	): Promise<void> {
		throw new Error('Not implemented');
	}

	async getDecrypted(
		_additionalData: IWorkflowExecuteAdditionalData,
		_nodeCredentials: INodeCredentialsDetails,
		type: string,
		_mode: WorkflowExecuteMode,
		_executeData?: IExecuteData,
		_raw?: boolean,
		_expressionResolveValues?: ICredentialsExpressionResolveValues,
	): Promise<ICredentialDataDecryptedObject> {
		return this.credentials[type];
	}

	async updateCredentials(
		_nodeCredentials: INodeCredentialsDetails,
		_type: string,
		_data: ICredentialDataDecryptedObject,
	): Promise<void> {}

	getCredentialsProperties(_type: string): INodeProperties[] {
		return [];
	}

	/**
	 * Resolves the given value in case it is an expression
	 */
	private resolveValue(
		parameterValue: string,
		additionalKeys: IWorkflowDataProxyAdditionalKeys,
		workflow: Workflow,
		node: INode,
	): string {
		if (!isExpression(parameterValue)) {
			return parameterValue;
		}

		const returnValue = workflow.expression.getSimpleParameterValue(
			node,
			parameterValue,
			'internal',
			additionalKeys,
			undefined,
			'',
		);

		if (!returnValue) {
			return '';
		}

		return returnValue.toString();
	}
}
