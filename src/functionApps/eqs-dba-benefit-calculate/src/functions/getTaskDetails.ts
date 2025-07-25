import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BenefitCalculationService } from '../services/benefitCalculationService';
import { responseBuilder } from "../utils/helpers";

const benefitService = new BenefitCalculationService();

export async function getTaskDetails(
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

    const taskDetails = await benefitService.getTaskDetails(processInstanceId);

    if (!taskDetails.taskId) {
      return responseBuilder.notFound(
        request,
        `No active tasks found for process instance: ${processInstanceId}`
      );
    }

    context.log('Task details retrieved successfully:', {
      processInstanceId,
      taskId: taskDetails.taskId,
      requiredFieldsCount: taskDetails.requiredFields.length
    });

    return responseBuilder.success(request, taskDetails);

  } catch (error) {
    const err = error as Error;
    context.error('Error in getTaskDetails:', error);

    if (err.message.includes('not found')) {
      return responseBuilder.notFound(
        request,
        'Process instance not found'
      );
    }

    return responseBuilder.internalServerError(
      request,
      'Failed to get task details',
      err.message
    );
  }
}

app.http('getTaskDetails', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'benefit/task/{processInstanceId}',
  handler: getTaskDetails
});