import {IDataObject, IExecuteFunctions, INodeExecutionData} from "n8n-workflow";
import {httpCall} from "../../common/util.js";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";

export async function getAll(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const searchOptions = exec.getNodeParameter('searchOptions', index) as {
        modelId: INodeParameterResourceLocator,
    };
    const responseData = await httpCall(exec, {
        method: 'GET',
        url: `/api/v1/objects`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        qs: {
            "where.model": searchOptions.modelId.value || undefined,
        }
    }) as IDataObject;
    return [
        ...exec.helpers.constructExecutionMetaData(
            exec.helpers.returnJsonArray(responseData),
            {itemData: {item: index}},
        )
    ];
}
