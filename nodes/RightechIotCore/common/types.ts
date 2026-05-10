import {GenericValue, IExecuteFunctions, INodeExecutionData} from "n8n-workflow";

export interface RicApiCred {
    ricServer: string,
    ricAccessToken: string,
}

export const N8N_RESOURCE_MAPPING_MODE_AUTO = 'autoMapInputData';
export const N8N_RESOURCE_MAPPING_MODE_MANUAL = 'defineBelow';

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

export interface RicModelDataDescriptor {
    id: string;
    name: string;
    active: boolean;
    type: "subsystem" | "argument" | "config" | "action";
    dataType: string;
    children?: RicModelDataDescriptor[];
    [key: string]: unknown;
}

export interface RicModelRootDataDescriptor extends RicModelDataDescriptor {
    id: string;
    name: string;
    active: boolean;
    type: "subsystem";
    dataType: string;
    children: RicModelDataDescriptor[];
    _isRoot: true;
}

export interface RicModelConfigDescriptor extends RicModelDataDescriptor {
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

export type RicTelemetryDataTypes = 'number' | 'boolean' | 'string' | 'object' | 'number[]' | 'boolean[]' | 'string[]';

export interface RicModelArgument {
    // Parameters from the base model (the base template)
    _base?: boolean,
    _parentId?: string,
    id: string,
    name: string,
    active: boolean,
    type: 'argument',
    reference?: string, // online, _ts, time
    dataType: RicTelemetryDataTypes,
    unit?: string,
}

export interface RicPerObjectModelDeepAndFlat {
    _id: string,
    name: string,
    base: string,
    owner: string,
    group: string,
    time: number,
    _object: {
        _id: string,
        model: string,
        id: string,
        name: string,
        group: string,
    },
    _configs: RicModelConfigDescriptor[],
    _arguments: RicModelArgument[],
    _actions: unknown[],
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

export interface RicEventShell {
    event: string,
    time: number,
    data: object,
    [key: string]: GenericValue,
}

export const RicKnownEvents: Record<string, string> = {
    'object-online': 'Object: comes online',
    'object-offline': 'Object: comes offline',
    'object-insert': 'Object: created',
    'object-update': 'Object: updated',
    'object-remove': 'Object: deleted',
    'object-command-req': 'Command: sent',
    'object-command-res': 'Command: completed',
    'object-command-err': 'Command: failed',
};
