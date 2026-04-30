import {IDataObject, IExecuteFunctions, INodeExecutionData} from "n8n-workflow";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";
import {httpCall} from "../../common/util.js";

export async function stop(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const objectId = exec.getNodeParameter('objectId', index) as INodeParameterResourceLocator;
    const scenarioId = exec.getNodeParameter('scenarioId', index) as INodeParameterResourceLocator;
    const responseData = await httpCall(exec, {
        method: 'POST',
        url: `/api/v1/objects/${objectId.value}/automatons/${scenarioId.value}/stop`,
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
