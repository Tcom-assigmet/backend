import { HttpResponseInit } from "@azure/functions";


export const createErrorResponse = (status: number, message: string): HttpResponseInit => ({
    status,
    jsonBody: { error: message }
});

export const createSuccessResponse = (data: any): HttpResponseInit => ({
    status: 200,
    jsonBody: data
});

export const createSuccessMessageResponse = (message: string): HttpResponseInit => ({
    status: 200,
    body: message
});


