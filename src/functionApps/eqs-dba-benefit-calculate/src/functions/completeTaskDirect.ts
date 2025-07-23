import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BenefitCalculationService } from '../services/benefitCalculationService';
import { createErrorResponse, createSuccessResponse } from '../utils/helpers';
import { CompleteTaskRequest } from "../models/types";

const benefitService = new BenefitCalculationService();

export async function completeTaskDirect(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    try {
        const taskId = request.params.taskId;
        
        if (!taskId) {
            return createErrorResponse(400, 'Task ID is required');
        }
        
        const requestBody = await request.json();
        
        const response = await benefitService.completeTaskDirect(taskId, requestBody as CompleteTaskRequest);
        
        return createSuccessResponse(response);
    } catch (error: unknown) {
        const err = error as Error;
        context.error('Error in completeTaskDirect:', error);
        return createErrorResponse(500, `Failed to complete task: ${err.message}`);
    }
}



app.http('completeTaskDirect', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'benefit/complete-task/{taskId}',
    handler: completeTaskDirect
});

