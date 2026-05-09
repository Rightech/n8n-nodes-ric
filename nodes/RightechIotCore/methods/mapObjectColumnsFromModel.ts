import {ILoadOptionsFunctions, ResourceMapperField, ResourceMapperFields} from "n8n-workflow";
import {httpCall, ricConfigToResourceMapperField} from "../common/util.js";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";
import {isConfigDescriptor, RicGroupDescriptor, RicModelDataDescriptor, RicModelDescriptor} from "../common/types.js";

function unrollDescriptors(data: RicModelDataDescriptor, idPrefix: string, namePrefix: string): RicModelDataDescriptor[] {
    const children = data.type === 'subsystem' || data.type === 'argument'
        ? (data.children ?? []).flatMap(c => unrollDescriptors(c, `${data.id}.`, `${data.name}: `))
        : [];
    return [
        {
            ...data,
            id: `${idPrefix}${data.id}`,
            name: `${namePrefix}${data.name}`
        },
        ...children
    ];
}

export async function mapObjectColumnsFromModel(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
    const modelId = this.getCurrentNodeParameter('modelId') as INodeParameterResourceLocator;
    if (!modelId?.value) {
        return {
            fields: [],
            emptyFieldsNotice: "Select a model to derive configuration.",
        }
    }
    try {
        const modelData = await httpCall(this, {
            method: 'GET',
            url: `/api/v1/models/${modelId.value}`,
            json: true,
        }) as RicModelDescriptor;
        const groupData = await httpCall(this, {
            method: 'GET',
            url: `/api/v1/groups/${modelData.group}`,
            json: true,
        }) as RicGroupDescriptor;
        const configs = modelData.data.children
            .flatMap(c => unrollDescriptors(c, "", ""))
            .filter(isConfigDescriptor).filter(d => d.active);
        const fields: ResourceMapperField[] = [
            {
                id: '@tagname',
                displayName: '@tagname',
                type: 'string',
                defaultValue: groupData.tagname,
                required: false,
                defaultMatch: false,
                canBeUsedToMatch: false,
                readOnly: true,
                display: false,
            },
            {
                id: '@idPrefix',
                displayName: '@idPrefix',
                type: 'string',
                defaultValue: modelData.props.prefix ?? '',
                required: false,
                defaultMatch: false,
                canBeUsedToMatch: false,
                readOnly: true,
                display: false,
            },
            {
                id: 'id',
                displayName: modelData.props.idInput?.label ?? 'Device ID',
                type: 'string',
                defaultValue: modelData.props.idPattern ?? modelData.props.prefix ?? '',
                required: false,
                defaultMatch: true,
                display: true,
            },
            {
                id: 'name',
                displayName: 'Name',
                type: 'string',
                defaultValue: modelData.props.namePattern ?? '',
                required: false,
                defaultMatch: false,
                display: true,
            },
        ];
        if (modelData.props.descriptionInput) {
            fields.push({
                id: 'description',
                displayName: 'Description',
                type: 'string',
                defaultValue: '',
                required: false,
                defaultMatch: true,
                display: true,
            });
        }
        if (modelData.props.typeInput) {
            fields.push({
                id: 'type',
                displayName: 'Type',
                type: 'string',
                defaultValue: '',
                required: false,
                defaultMatch: false,
                display: true,
            });
        }
        if (modelData.props.statusInput) {
            if (modelData.props.statuses) {
                fields.push({
                    id: 'status',
                    displayName: 'Status',
                    type: 'options',
                    defaultValue: '',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    options: modelData.props.statuses.map(o => ({
                        name: o.name,
                        value: o.id,
                    }))
                });
            } else {
                fields.push({
                    id: 'status',
                    displayName: 'Status',
                    type: 'string',
                    defaultValue: '',
                    required: false,
                    defaultMatch: false,
                    display: true,
                });
            }
        }
        if (modelData.props.auth) {
            fields.push({
                id: 'config.auth.username',
                displayName: `${modelData.props.auth.title}: ${modelData.props.auth.fields.username.title}`,
                type: 'string',
                defaultValue: '',
                required: false,
                defaultMatch: false,
                display: true,
            });
            fields.push({
                id: 'config.auth.password',
                displayName: `${modelData.props.auth.title}: ${modelData.props.auth.fields.password.title}`,
                type: 'string',
                defaultValue: '',
                required: false,
                defaultMatch: false,
                display: true,
            });
        }
        fields.push({
            id: 'config.position.display',
            displayName: `Position: display from`,
            type: 'options',
            defaultValue: 'state',
            required: false,
            defaultMatch: false,
            display: true,
            options: [
                {name: 'State', value: 'state'},
                {name: 'Config', value: 'config'},
            ]
        });
        fields.push({
            id: 'config.position.lat',
            displayName: `Position: latitude`,
            type: 'number',
            defaultValue: null,
            required: false,
            defaultMatch: false,
            display: true,
        });
        fields.push({
            id: 'config.position.lon',
            displayName: `Position: longitude`,
            type: 'number',
            defaultValue: null,
            required: false,
            defaultMatch: false,
            display: true,
        });
        return {
            fields: [
                ...fields,
                ...configs.map(ricConfigToResourceMapperField),
            ],
            emptyFieldsNotice: configs.length === 0 ? "Model does not have any configuration fields." : undefined,
        }
    } catch (error) {
        return {
            fields: [],
            emptyFieldsNotice: "Failed to load configuration: " + error.toString(),
        }
    }
}
