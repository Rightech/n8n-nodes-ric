import {IDataObject, IExecuteFunctions, IHttpRequestOptions, INodeExecutionData} from "n8n-workflow";
import {httpCall} from "../../common/util.js";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";

export async function getAll(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const searchOptions = exec.getNodeParameter('searchOptions', index) as {
        modelId: INodeParameterResourceLocator,
    };
    const customQueryParameters = exec.getNodeParameter('customQueryParameters', index) as {
        parameters: {query: string, value: string}[],
    };
    exec.logger.info(JSON.stringify(customQueryParameters));
    const qs: IDataObject = {
        "where.model": searchOptions.modelId.value || undefined,
    };
    for (const parameter of customQueryParameters.parameters) {
        qs[parameter.query] = parameter.value
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
