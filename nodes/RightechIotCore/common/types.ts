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
