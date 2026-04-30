import {GenericValue, IDataObject, IExecuteFunctions, INodeExecutionData} from "n8n-workflow";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";
import {httpCall} from "../../common/util.js";

export async function sendCommand(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const objectId = exec.getNodeParameter('objectId', index) as INodeParameterResourceLocator;
    const commandId = exec.getNodeParameter('commandId', index) as INodeParameterResourceLocator;
    const commandOptions = exec.getNodeParameter('commandOptions', index) as {
        commandAuxiliaryData?: GenericValue // todo: technically, commands have schemas, but they can be pretty complicated to parse
    };
    const responseData = await httpCall(exec, {
        method: 'POST',
        url: `/api/v1/objects/${objectId.value}/commands/${commandId.value}`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        json: commandOptions.commandAuxiliaryData !== undefined,
        body: commandOptions.commandAuxiliaryData,
    }) as IDataObject;
    return [
        ...exec.helpers.constructExecutionMetaData(
            exec.helpers.returnJsonArray(responseData),
            {itemData: {item: index}},
        )
    ];
}
