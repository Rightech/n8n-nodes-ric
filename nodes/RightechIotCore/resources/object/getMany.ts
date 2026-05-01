import {IDataObject, IExecuteFunctions, IHttpRequestOptions, INodeExecutionData, ResourceMapperValue} from "n8n-workflow";
import {httpCall} from "../../common/util.js";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";

export async function getMany(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const modelId = exec.getNodeParameter('modelId', index) as INodeParameterResourceLocator;
    const customQueryParameters = exec.getNodeParameter('customQueryParameters', index) as {
        parameters?: {query: string, value: string}[],
    };
    const modelOptions = exec.getNodeParameter('modelOptions', index) as ResourceMapperValue;
    const qs: IDataObject = {
        "where.model": modelId?.value || undefined,
    };
    if (modelOptions.value) {
        for (const prop in modelOptions.value) {
            qs["where.config." + prop] = modelOptions.value[prop];
        }
    }
    if (customQueryParameters.parameters) {
        for (const parameter of customQueryParameters.parameters) {
            qs[parameter.query] = parameter.value
        }
    }
    const request: IHttpRequestOptions = {
        method: 'GET',
        url: `/api/v1/objects`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        qs
    };
    const responseData = await httpCall(exec, request) as IDataObject;
    return [
        ...exec.helpers.constructExecutionMetaData(
            exec.helpers.returnJsonArray(responseData),
            {itemData: {item: index}},
        )
    ];
}
