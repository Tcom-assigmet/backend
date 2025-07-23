import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BenefitCalculationService } from '../services/benefitCalculationService';
import { createErrorResponse, createSuccessResponse } from '../utils/helpers';
import { StartProcessRequest } from '../models/types';

const benefitService = new BenefitCalculationService();

export async function startBenefitCalculation(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const requestBody = await request.json() as StartProcessRequest;
        const response = await benefitService.startBenefitCalculation(requestBody);
        
        return createSuccessResponse(response);
    } catch (error: unknown) {
        const err = error as Error;
        context.error('Error in startBenefitCalculation:', error);
        return createErrorResponse(500, `Failed to start process: ${err.message}`);
    }
}

app.http('startBenefitCalculation', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'benefit/start',
    handler: startBenefitCalculation
});


