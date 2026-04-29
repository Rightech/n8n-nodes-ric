import {IDataObject, IExecuteFunctions, INodeExecutionData, ResourceMapperValue} from "n8n-workflow";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";
import {httpCall} from "../../common/util.js";

export async function getRows(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const tableId = exec.getNodeParameter('tableId', index) as INodeParameterResourceLocator;
    const queryColumns = exec.getNodeParameter('queryColumns', index) as ResourceMapperValue;
    const responseData = await httpCall(exec, {
        method: 'GET',
        url: `/api/v1/tables/${tableId.value}/rows`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        qs: {
            ...queryColumns.value
        }
    }) as IDataObject;
    return [
        ...exec.helpers.constructExecutionMetaData(
            exec.helpers.returnJsonArray(responseData),
            {itemData: {item: index}},
        )
    ];
}
