import {IExecuteFunctions, INodeExecutionData} from "n8n-workflow";

export interface RicApiCred {
    ricServer: string,
    ricAccessToken: string,
}

export type handlerFn = (exec: IExecuteFunctions, index: number) => Promise<INodeExecutionData[]>;

export const RicApiCredName = 'rightechIotCoreApi';

export interface RicApiTableIndex {
    _id: string,
    name: string,
    description?: string,
    displayColumn: string,
    columns: {
        id: string,
        name: string,
        dataType: "string" | "number" | "boolean" | "date",
    }[],
}

export interface RicModelRootDataDescriptor {
    id: string;
    name: string;
    active: boolean;
    type: string;
    dataType: string;
    children: RicModelDataDescriptor[];
    _isRoot: true;
}

export interface RicModelDataDescriptor {
    id: string;
    name: string;
    active: boolean;
    type: string;
    dataType: string;
    children?: RicModelDataDescriptor[];
}

export interface RicModelConfigDescriptor {
    id: string;
    name: string;
    active: boolean;
    type: 'config';
    ctrl: '' | 'Select' | 'Numeric' | 'Slider';
    dataType: 'string' | 'number' | 'boolean' | 'table';
    defaultValue?: number | string;
    opts?: { // when ctrl === Select
        itemKey: "value",
        items: {
            value: string,
            name: string
        }[]
    }
}

export function isConfigDescriptor(data: RicModelDataDescriptor): data is RicModelConfigDescriptor {
    return data.type === 'config';
}

export interface RicModelDescriptor {
    base: string,
    group: string,
    data: RicModelRootDataDescriptor;
    props: {
        auth?: {
            title: string,
            fields: {
                username: {
                    title: string
                },
                password: {
                    secret: boolean, // todo: currently impossible to do with resourceMapper?
                    title: string
                }
            }
        },
        typeInput: {
            hidden: boolean
        },
        statusInput: {
            hidden: boolean
        },
        descriptionInput: {
            hidden: boolean
        },
        prefix?: string;
        idInput?: {
            label?: string;
        };
        idPattern?: string;
        namePattern?: string;
        statuses?: {
            id: string,
            name: string,
            color: string,
        }[];
    };
}

export interface RicGroupDescriptor {
    _id: string,
    role: string,
    name: string,
    tagname: string,
    group: string,
    active: boolean,
}

export interface RicEventOrgStructure {
    // All event types to ever occur
    unique: string[],
    // Model uuid to event map of types to ever occur on model or its objects
    byModel: {
        [key: string]: string[],
    },
    // Events that are not bound to any models, system events
    noModel: string[],
}
