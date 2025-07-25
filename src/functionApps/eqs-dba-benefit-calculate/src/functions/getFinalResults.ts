import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BenefitCalculationService } from '../services/benefitCalculationService';
import { FinalResultResponse } from '../models/types';
import { responseBuilder } from "../utils/helpers";

const benefitService = new BenefitCalculationService();

export async function getFinalResults(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const processInstanceId = request.params.processInstanceId;

    if (!processInstanceId) {
      return responseBuilder.badRequest(
        request,
        'Process instance ID is required'
      );
    }

    const result: FinalResultResponse = await benefitService.getFinalResults(processInstanceId, null);

    context.log('Final results retrieved successfully:', {
      processInstanceId: result.processInstanceId,
      taskId: result.taskId
    });

    return responseBuilder.success(request, result);

  } catch (error) {
    const err = error as Error;
    context.error('Error in getFinalResultsEndpoint:', error);

    if (err.message.includes('process not found')) {
      return responseBuilder.notFound(
        request,
        `Process instance not found: ${request.params.processInstanceId}`
      );
    }

    if (err.message.includes('process not completed')) {
      return responseBuilder.badRequest(
        request,
        'Process is still running. Final results not yet available.'
      );
    }

    return responseBuilder.internalServerError(
      request,
      'Failed to get final results',
      err.message
    );
  }
}

app.http('getFinalResults', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'benefit/results/{processInstanceId}',
  handler: getFinalResults
});