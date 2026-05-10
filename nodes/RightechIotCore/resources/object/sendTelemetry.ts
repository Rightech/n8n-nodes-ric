import {
    IDataObject,
    IExecuteFunctions,
    INodeExecutionData,
    INodeProperties,
    ResourceMapperValue
} from "n8n-workflow";
import {INodeParameterResourceLocator, ResourceMapperField} from "n8n-workflow/dist/esm/interfaces.js";
import {httpCall} from "../../common/util.js";
import {objectSelector} from "../../common/properties.js";

const displayOptions = {
    show: {
        resource: ['object'],
        operation: ['sendTelemetry'],
    },
};

export const objectSendTelemetryProperties: INodeProperties[] = [
    {
        ...objectSelector,
        displayOptions,
    },
    {
        displayName: 'Telemetry',
        name: 'telemetry',
        type: 'resourceMapper',
        default: {
            mappingMode: 'defineBelow',
            value: null,
        },
        displayOptions: {
            ...displayOptions,
            hide: {
                objectId: [''],
            }
        },
        typeOptions: {
            minRequiredFields: 1,
            resourceMapper: {
                resourceMapperMethod: "mapTelemetryParams",
                mode: "add",
                addAllFields: false,
                supportAutoMap: true,
            }
        },
    },
];

export async function sendTelemetry(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const objectId = exec.getNodeParameter('objectId', index) as INodeParameterResourceLocator;
    const telemetry = exec.getNodeParameter('telemetry', index) as ResourceMapperValue;
    const body: IDataObject = {};
    exec.logger.info(JSON.stringify(telemetry));
    const schemaMap: Record<string, ResourceMapperField> = {};
    for (const param of telemetry.schema) {
        schemaMap[param.id] = param;
    }
    if (telemetry.value) {
        for (const param in telemetry.value) {
            switch (schemaMap[param].type) {
                case 'array':
                case 'object':
                    body[param] = JSON.parse(telemetry.value[param] as string);
                    break;
                default:
                    body[param] = telemetry.value[param];
            }
        }
    }
    const responseData = await httpCall(exec, {
        method: 'POST',
        url: `/api/v1/objects/${objectId.value}/packets`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        json: true,
        body,
    }) as IDataObject;
    return [
        ...exec.helpers.constructExecutionMetaData(
            exec.helpers.returnJsonArray(responseData),
            {itemData: {item: index}},
        )
    ];
}
