import {ILoadOptionsFunctions, ResourceMapperFields} from "n8n-workflow";
import {httpCall} from "../common/util.js";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";

interface DataDescriptor {
    id: string;
    name: string;
    active: boolean;
    type: string;
    dataType: string;
    children?: DataDescriptor[];
}

interface ConfigDescriptor {
    id: string;
    name: string;
    active: boolean;
    type: 'config';
    dataType: 'string' | 'table';
}

interface ModelDescriptor {
    data: DataDescriptor;
}

function unrollDescriptors(data: DataDescriptor): DataDescriptor[] {
    return [data, ...(data.children ?? []).flatMap(unrollDescriptors)];
}

function isConfigDescriptor(data: DataDescriptor): data is ConfigDescriptor {
    return data.type === 'config' && (data.dataType === 'string' || data.dataType === 'table');
}

export async function mapObjectQuery(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
    const searchOptions = this.getCurrentNodeParameter('searchOptions') as {
        modelId?: INodeParameterResourceLocator,
    };
    if (!searchOptions.modelId?.value) {
        return {
            fields: [],
            emptyFieldsNotice: "ℹ️ Select a model to drive search by configuration.",
        }
    }
    try {
        const response = await httpCall(this, {
            method: 'GET',
            url: `/api/v1/models/${searchOptions.modelId.value}`,
            json: true,
        }) as ModelDescriptor;
        const configs = unrollDescriptors(response.data).filter(isConfigDescriptor).filter(d => d.active);
        return {
            fields: configs.map(c => ({
                id: `where.config.params.${c.id}`,
                displayName: c.name,
                type: 'string',
                required: false,
                defaultMatch: false,
                readOnly: false,
                removed: false,
                display: true,
            })),
            emptyFieldsNotice: configs.length === 0 ? "ℹ️ Model does not have any config fields." : undefined,
        }
    } catch (error) {
        return {
            fields: [],
            emptyFieldsNotice: "⚠️ Failed to load configuration: " + error.toString(),
        }
    }
}
