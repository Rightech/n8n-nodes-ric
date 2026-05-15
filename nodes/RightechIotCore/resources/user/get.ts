import {IDataObject, IExecuteFunctions, INodeExecutionData, type INodeProperties} from "n8n-workflow";
import {httpCall} from "../../common/util.js";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";
import {ricUuidPropertyMode} from "../../common/properties.js";

export const userGetProperties: INodeProperties[] = [
    {
        displayName: 'User',
        name: 'userId',
        required: true,
        type: 'resourceLocator',
        default: {
            mode: 'list',
            value: '',
        },
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                placeholder: 'Select a user...',
                typeOptions: {
                    searchListMethod: 'listUsers',
                    searchable: true,
                    searchFilterRequired: false,
                },
            },
            ricUuidPropertyMode,
        ],
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['get'],
            },
        },
    },
];

export async function get(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const userId = exec.getNodeParameter('userId', index) as INodeParameterResourceLocator;
    const responseData = await httpCall(exec, {
        method: 'GET',
        url: `/api/v1/users/${userId.value}?only=_id,role,group,name,login,email,phone`,
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
