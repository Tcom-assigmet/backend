import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BenefitCalculationService } from '../services/benefitCalculationService';
import { createErrorResponse, createSuccessResponse } from '../utils/helpers';

const benefitService = new BenefitCalculationService();

export async function getFinalResults(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    try {
        const processInstanceId = request.params.processInstanceId;
        
        if (!processInstanceId) {
            return createErrorResponse(400, 'Process instance ID is required');
        }
        
        const response = await benefitService.getFinalResults(processInstanceId, null);
        return createSuccessResponse(response);
    } catch (error:unknown) {
        const err = error as Error;
        context.error('Error in getFinalResultsEndpoint:', error);
        return createErrorResponse(500, `Failed to get final results: ${err.message}`);
    }
}

app.http('getFinalResults', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'benefit/results/{processInstanceId}',
    handler: getFinalResults
});
