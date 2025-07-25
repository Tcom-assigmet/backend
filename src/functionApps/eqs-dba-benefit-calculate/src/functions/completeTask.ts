import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BenefitCalculationService } from '../services/benefitCalculationService';
import { CompleteTaskRequest, FinalResultResponse } from '../models/types';
import { responseBuilder } from "../utils/helpers";

const benefitService = new BenefitCalculationService();

export async function completeTask(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    let requestBody: CompleteTaskRequest;
    try {
      requestBody = await request.json() as CompleteTaskRequest;
    } catch (parseError) {
      context.error('Failed to parse request body:', parseError);
      return responseBuilder.badRequest(
        request,
        'Invalid JSON in request body'
      );
    }

    if (!requestBody.processInstanceId) {
      return responseBuilder.badRequest(
        request,
        'Process instance ID is required'
      );
    }

    const result: FinalResultResponse = await benefitService.completeTask(requestBody);

    context.log('Task completed successfully:', {
      processInstanceId: result.processInstanceId,
      taskId: result.taskId
    });

    return responseBuilder.success(request, result);

  } catch (error) {
    const err = error as Error;
    context.error('Error in completeTask:', error);

    if (err.message.includes('Failed to get task ID')) {
      return responseBuilder.notFound(
        request,
        'Task not found or already completed'
      );
    }

    if (err.message.includes('invalid variables')) {
      return responseBuilder.badRequest(
        request,
        'Invalid task variables provided'
      );
    }

    return responseBuilder.internalServerError(
      request,
      'Failed to complete task',
      err.message
    );
  }
}

app.http('completeTask', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'benefit/complete',
  handler: completeTask
});