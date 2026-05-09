import {IDataObject, IExecuteFunctions, IHttpRequestOptions, INodeExecutionData, INodeProperties} from "n8n-workflow";
import {httpCall} from "../../common/util.js";

const displayOptions = {
    show: {
        resource: ['event'],
        operation: ['getMany'],
    },
};

export const eventGetManyProperties: INodeProperties[] = [
    {
        displayName: 'System can amass a lot of events, so to keep your workflows efficient - try to filter them to the only ones you need.',
        name: 'getEventsEfficiencyNotice',
        type: 'notice',
        default: '',
        displayOptions,
    },
    {
        displayName: 'From',
        name: 'from',
        required: true,
        type: 'dateTime',
        default: '',
        displayOptions,
    },
    {
        displayName: 'To',
        name: 'to',
        required: true,
        type: 'dateTime',
        default: '',
        displayOptions,
    },
    {
        displayName: 'Only Include Event Types',
        name: 'include',
        description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        type: 'multiOptions',
        hint: 'All events are included by default unless specified',
        default: [],
        typeOptions: {
            loadOptionsMethod: 'eventOptions'
        },
        displayOptions,
    },
    {
        displayName: 'Exclude Event Types',
        name: 'exclude',
        description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        type: 'multiOptions',
        default: [],
        typeOptions: {
            loadOptionsMethod: 'eventOptions'
        },
        displayOptions,
    },
]

export async function getMany(exec: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
    const from = exec.getNodeParameter("from", index) as string;
    const to = exec.getNodeParameter("to", index) as string;
    const include = exec.getNodeParameter("include", index) as string[];
    const exclude = exec.getNodeParameter("exclude", index) as string[];
    const qs: IDataObject = {
        from: new Date(from).getTime(),
        to: new Date(to).getTime(),
        events: include.length ? include.join(',') : undefined,
        "events!": exclude.length ? exclude.join(',') : undefined,
    };
    const request: IHttpRequestOptions = {
        method: 'GET',
        url: `/api/v1/events`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        qs
    };
    const responseData = await httpCall(exec, request) as IDataObject;
    return [
        ...exec.helpers.constructExecutionMetaData(
            exec.helpers.returnJsonArray(responseData),
            {itemData: {item: index}},
        )
    ];
}
