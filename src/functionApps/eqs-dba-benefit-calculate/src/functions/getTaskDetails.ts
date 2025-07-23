import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BenefitCalculationService } from '../services/benefitCalculationService';
import { createErrorResponse, createSuccessResponse} from '../utils/helpers';

const benefitService = new BenefitCalculationService();

export async function getTaskDetails(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    try {
        const processInstanceId = request.params.processInstanceId;
        
        if (!processInstanceId) {
            return createErrorResponse(400, 'Process instance ID is required');
        }
        
        const response = await benefitService.getTaskDetails(processInstanceId);
        return createSuccessResponse(response);
    } catch (error: unknown) {
        const err = error as Error;
        context.error('Error in getTaskDetails:', error);
        return createErrorResponse(500, `Failed to get task details: ${err.message}`);
    }
}

app.http('getTaskDetails', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'benefit/task/{processInstanceId}',
    handler: getTaskDetails
});

