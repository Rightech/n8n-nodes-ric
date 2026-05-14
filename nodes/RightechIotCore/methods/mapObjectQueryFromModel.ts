import {ILoadOptionsFunctions, ResourceMapperField, ResourceMapperFields} from "n8n-workflow";
import {httpCall, ricConfigToResourceMapperField, unrollModelDescriptors} from "../common/util.js";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";
import {isConfigDescriptor, RicModelDescriptor} from "../common/types.js";

export async function mapObjectQueryFromModel(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
    const modelId = this.getCurrentNodeParameter('modelId') as INodeParameterResourceLocator;
    if (!modelId?.value) {
        return {
            fields: [],
            emptyFieldsNotice: "You can search by model dependent configs if you select a model.",
        }
    }
    try {
        const modelData = await httpCall(this, {
            method: 'GET',
            url: `/api/v1/models/${modelId.value}`,
            json: true,
        }) as RicModelDescriptor;
        const configs = modelData.data.children
            .flatMap(c => unrollModelDescriptors(c, "", ""))
            .filter(isConfigDescriptor).filter(d => d.active);
        const fields: ResourceMapperField[] = [];
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
        }
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
