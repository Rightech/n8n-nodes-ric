import {
    ICredentialDataDecryptedObject, ICredentialsExpressionResolveValues,
    ICredentialsHelper, ICredentialType, ICredentialTypes, IExecuteData, IHttpRequestHelper,
    IHttpRequestOptions, INode, INodeCredentialsDetails, INodeProperties,
    IRequestOptionsSimplified, isExpression,
    IWorkflowDataProxyAdditionalKeys, IWorkflowExecuteAdditionalData, Workflow, WorkflowExecuteMode
} from "n8n-workflow";
import {Credentials} from "n8n-core";
import {RightechIotCoreApi} from "../../../../credentials/RightechIotCoreApi.credentials.js";

export class CredentialTypes implements ICredentialTypes {
    recognizes(type: string) {
        return type === 'rightechIotCoreApi';
    }

    getByName(credentialType: string): ICredentialType {
        if (credentialType === 'rightechIotCoreApi') {
            return new RightechIotCoreApi;
        }
        throw new Error(`Unknown credential type ${credentialType}`);
    }

    getSupportedNodes(type: string): string[] {
        if (type === 'rightechIotCoreApi') {
            return [
                '@rightech/n8n-nodes-ric.rightechIotCore',
                'CUSTOM.rightechIotCore',
            ];
        }
        return [];
    }

    /**
     * Returns all parent types of the given credential type
     */
    getParentTypes(typeName: string): string[] {
        return [];
    }
}

export class CredentialsHelper extends ICredentialsHelper {
    private credentials: Record<string, ICredentialDataDecryptedObject>;
    private credentialTypes: ICredentialTypes;

    constructor(credentials: Record<string, ICredentialDataDecryptedObject>) {
        super();
        this.credentials = credentials;
        this.credentialTypes = new CredentialTypes;
    }

    getParentTypes(name: string): string[] {
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

                            // @ts-ignore
                            if (!requestOptions[outerKey]) {
                                // @ts-ignore
                                requestOptions[outerKey] = {};
                            }
                            // @ts-ignore
                            requestOptions[outerKey][keyResolved] = valueResolved;
                        });
                    });
                }
            }
        }
        return requestOptions as IHttpRequestOptions;
    }

    async preAuthentication(
        helpers: IHttpRequestHelper,
        credentials: ICredentialDataDecryptedObject,
        typeName: string,
        node: INode,
        credentialsExpired: boolean,
    ): Promise<ICredentialDataDecryptedObject | undefined> {
        return undefined;
    }

    /**
     * Returns the credentials instance
     */
    async getCredentials(
        nodeCredential: INodeCredentialsDetails,
        type: string,
    ): Promise<Credentials> {
        throw new Error("Not implemented");
    }

    async getDecrypted(
        additionalData: IWorkflowExecuteAdditionalData,
        nodeCredentials: INodeCredentialsDetails,
        type: string,
        mode: WorkflowExecuteMode,
        executeData?: IExecuteData,
        raw?: boolean,
        expressionResolveValues?: ICredentialsExpressionResolveValues,
    ): Promise<ICredentialDataDecryptedObject> {
        return this.credentials[type];
    }

    async updateCredentials(
        nodeCredentials: INodeCredentialsDetails,
        type: string,
        data: ICredentialDataDecryptedObject,
    ): Promise<void> {
    }

    getCredentialsProperties(type: string): INodeProperties[] {
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