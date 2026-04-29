
export interface RicApiCred {
    ricServer: string,
    ricAccessToken: string,
}

export const RicApiCredName = 'rightechIotCloudApi';

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
