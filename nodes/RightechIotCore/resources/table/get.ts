import {IDataObject, IExecuteFunctions, INodeExecutionData, type INodeProperties} from "n8n-workflow";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";
import {httpCall} from "../../common/util.js";
import {tableSelector} from "../../common/properties.js";

const displayOptions = {
    show: {
        resource: ['table'],
        operation: ['get'],
    },
};

export const tableGetProperties: INodeProperties[] = [
    {
        ...tableSelector,
        displayOptions,
    },
];

export async function get(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const tableId = exec.getNodeParameter('tableId', index) as INodeParameterResourceLocator;
    const responseData = await httpCall(exec, {
        method: 'GET',
        url: `/api/v1/tables/${tableId.value}`,
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
