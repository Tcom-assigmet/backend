import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BenefitCalculationService } from '../services/benefitCalculationService';
import { createErrorResponse, createSuccessResponse } from '../utils/helpers';
import {  CompleteTaskRequest } from '../models/types';

const benefitService = new BenefitCalculationService();

export async function completeTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    try {
        const requestBody = await request.json() as CompleteTaskRequest;
        const response = await benefitService.completeTask(requestBody);
        
        return createSuccessResponse(response);
    } catch (err: unknown) {
        const error = err as Error;
        context.error('Error in completeTask:', error);
        return createErrorResponse(500, `Failed to complete task: ${error.message}`);
    }
}


app.http('completeTask', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'benefit/complete',
    handler: completeTask
});

