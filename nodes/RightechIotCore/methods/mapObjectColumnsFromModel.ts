import {ILoadOptionsFunctions, ResourceMapperFields} from "n8n-workflow";
import {httpCall} from "../common/util.js";
import {INodeParameterResourceLocator} from "n8n-workflow/dist/esm/interfaces.js";

interface RootDataDescriptor {
    id: string;
    name: string;
    active: boolean;
    type: string;
    dataType: string;
    children: DataDescriptor[];
    _isRoot: true;
}

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
    data: RootDataDescriptor;
}

function unrollDescriptors(data: DataDescriptor, idPrefix: string): DataDescriptor[] {
    return [{...data, id: `${idPrefix}${data.id}`}, ...(data.children ?? []).flatMap(c => unrollDescriptors(c, `${idPrefix}${data.id}.`))];
}

function isConfigDescriptor(data: DataDescriptor): data is ConfigDescriptor {
    return data.type === 'config' && (data.dataType === 'string' || data.dataType === 'table');
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
        const response = await httpCall(this, {
            method: 'GET',
            url: `/api/v1/models/${modelId.value}`,
            json: true,
        }) as ModelDescriptor;
        const configs = response.data.children
            .flatMap(c => unrollDescriptors(c, ""))
            .filter(isConfigDescriptor).filter(d => d.active);
        return {
            fields: configs.map(c => ({
                id: c.id,
                displayName: c.name,
                type: 'string',
                required: false,
                defaultMatch: false,
                readOnly: false,
                removed: false,
                display: true,
            })),
            emptyFieldsNotice: configs.length === 0 ? "Model does not have any configuration fields." : undefined,
        }
    } catch (error) {
        return {
            fields: [],
            emptyFieldsNotice: "Failed to load configuration: " + error.toString(),
        }
    }
}
