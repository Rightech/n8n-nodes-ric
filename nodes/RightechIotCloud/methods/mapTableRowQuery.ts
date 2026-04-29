import {ILoadOptionsFunctions, ResourceMapperFields} from "n8n-workflow/dist/esm/interfaces.js";
import {RicApiCred, RicApiCredName, RicApiTableIndex} from "../common/types.js";
import {IHttpRequestOptions} from "n8n-workflow";
import {readResourceLocatorId} from "../common/util.js";

export async function mapTableRowQuery(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
    const tableId = readResourceLocatorId(this, 'tableId');
    if (!tableId) {
        return {
            fields: [],
            emptyFieldsNotice: "Select a table",
        }
    }
    const cred = await this.getCredentials<RicApiCred>(RicApiCredName);
    const request: IHttpRequestOptions = {
        method: 'GET',
        url: `${cred.ricServer}/api/v1/tables/${tableId}`,
        json: true,
    };
    try {
        const responseData: RicApiTableIndex = await this.helpers.httpRequestWithAuthentication.call(this, RicApiCredName, request);
        return {
            fields: responseData.columns.map(c => ({
                id: `${tableId}::${c.id}`,
                displayName: c.name,
                type: c.dataType === 'date' ? 'dateTime' : c.dataType,
                required: false,
                defaultMatch: false,
                readOnly: false,
                removed: false,
                display: true,
            })),
            emptyFieldsNotice: responseData.columns.length === 0 ? "⚠️ Table has no columns!" : undefined,
        }
    } catch (error) {
        return {
            fields: [],
            emptyFieldsNotice: "⚠️ Failed to load configuration: " + error.toString(),
        }
    }
}
