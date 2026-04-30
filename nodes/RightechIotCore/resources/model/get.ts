import {IDataObject, IExecuteFunctions, INodeExecutionData} from "n8n-workflow";
import {httpCall} from "../../common/util.js";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";

export async function get(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const modelId = exec.getNodeParameter('modelId', index) as INodeParameterResourceLocator;
    const responseData = await httpCall(exec, {
        method: 'GET',
        url: `/api/v1/models/${modelId.value}`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }) as IDataObject;
    return [
        ...exec.helpers.constructExecutionMetaData(
            exec.helpers.returnJsonArray(responseData),
            {itemData: {item: index}},
        )
    ];
}
