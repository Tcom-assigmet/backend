import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BenefitCalculationService } from '../services/benefitCalculationService';
import { validationService } from '../utils/validation';
import { StartProcessRequest, ProcessResponse } from '../models/types';
import { responseBuilder } from "../utils/helpers";

const benefitService = new BenefitCalculationService();

export async function startBenefitCalculation(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Parse request body
    let requestBody: StartProcessRequest;
    try {
      requestBody = await request.json() as StartProcessRequest;
    } catch (parseError) {
      context.error('Failed to parse request body:', parseError);
      return responseBuilder.badRequest(
        request,
        'Invalid JSON in request body'
      );
    }

    // Validate request
    const validationErrors = validationService.validateStartProcessRequest(requestBody);
    if (validationErrors.length > 0) {
      context.warn('Validation failed:', validationErrors);
      return responseBuilder.badRequest(
        request,
        'Validation failed',
        validationErrors
      );
    }

    // Process the request
    const response: ProcessResponse = await benefitService.startBenefitCalculation(requestBody);

    context.log('Benefit calculation started successfully:', {
      processInstanceId: response.processInstanceId,
      taskId: response.taskId
    });

    return responseBuilder.created(request, response);

  } catch (error) {
    const err = error as Error;
    context.error('Error in startBenefitCalculation:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });

    // Handle specific error types
    if (err.message.includes('process not found')) {
      return responseBuilder.notFound(request, 'Process definition not found');
    }

    if (err.message.includes('service unavailable')) {
      return responseBuilder.serviceUnavailable(
        request,
        'Camunda service is currently unavailable'
      );
    }

    return responseBuilder.internalServerError(
      request,
      'Failed to start benefit calculation process',
      err.message
    );
  }
}

app.http('startBenefitCalculation', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'benefit/start',
  handler: startBenefitCalculation
});