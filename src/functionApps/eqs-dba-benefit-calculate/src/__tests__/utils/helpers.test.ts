import { HttpRequest } from '@azure/functions';
import { 
  createErrorResponse, 
  createSuccessResponse, 
  createSuccessResponseStartCal,
  createSuccessResponseTaskDetails,
  createSuccessMessageResponse,
  HttpStatusCode,
  ErrorCode,
  responseBuilder
} from '../../utils/helpers';
import { 
  FinalResultResponse, 
  ProcessResponse, 
  RequiredField, 
  ValidationError,
  MemberData,
  SubProcessData
} from '../../models/types';
import { createMockHttpRequest } from '../testUtils';

describe('Helper Functions', () => {
  const mockRequest = createMockHttpRequest({
    url: '/api/benefit/start',
    method: 'POST'
  });

  describe('createErrorResponse', () => {
    it('should create error response with correct status and message', () => {
      const response = createErrorResponse(400, 'Bad Request');
      
      expect(response.status).toBe(400);
      expect(response.jsonBody).toEqual({ error: 'Bad Request' });
    });

    it('should handle different status codes', () => {
      const statuses = [400, 401, 404, 500];
      
      statuses.forEach(status => {
        const response = createErrorResponse(status, 'Test error');
        expect(response.status).toBe(status);
        expect(response.jsonBody).toEqual({ error: 'Test error' });
      });
    });
  });

  describe('createSuccessResponse', () => {
    it('should create success response for FinalResultResponse', () => {
      const data: FinalResultResponse = {
        message: 'Process completed successfully',
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        memberData: {} as MemberData,
        subProcessData: {} as SubProcessData
      };

      const response = createSuccessResponse(data);
      
      expect(response.status).toBe(200);
      expect(response.jsonBody).toEqual(data);
    });
  });

  describe('createSuccessResponseStartCal', () => {
    it('should create success response for ProcessResponse', () => {
      const data: ProcessResponse = {
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        requiredFields: []
      };

      const response = createSuccessResponseStartCal(data);
      
      expect(response.status).toBe(200);
      expect(response.jsonBody).toEqual(data);
    });
  });

  describe('createSuccessResponseTaskDetails', () => {
    it('should create success response for task details', () => {
      const requiredFields: RequiredField[] = [
        { name: 'field1', type: 'string', required: true },
        { name: 'field2', type: 'number', required: false }
      ];

      const data = {
        taskId: 'task-123',
        requiredFields
      };

      const response = createSuccessResponseTaskDetails(data);
      
      expect(response.status).toBe(200);
      expect(response.jsonBody).toEqual(data);
    });
  });

  describe('createSuccessMessageResponse', () => {
    it('should create success response with message body', () => {
      const message = 'Operation completed successfully';
      const response = createSuccessMessageResponse(message);
      
      expect(response.status).toBe(200);
      expect(response.body).toBe(message);
    });
  });

  describe('HttpStatusCode enum', () => {
    it('should have correct status code values', () => {
      expect(HttpStatusCode.OK).toBe(200);
      expect(HttpStatusCode.CREATED).toBe(201);
      expect(HttpStatusCode.ACCEPTED).toBe(202);
      expect(HttpStatusCode.NO_CONTENT).toBe(204);
      expect(HttpStatusCode.BAD_REQUEST).toBe(400);
      expect(HttpStatusCode.UNAUTHORIZED).toBe(401);
      expect(HttpStatusCode.FORBIDDEN).toBe(403);
      expect(HttpStatusCode.NOT_FOUND).toBe(404);
      expect(HttpStatusCode.CONFLICT).toBe(409);
      expect(HttpStatusCode.UNPROCESSABLE_ENTITY).toBe(422);
      expect(HttpStatusCode.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HttpStatusCode.SERVICE_UNAVAILABLE).toBe(503);
    });
  });

  describe('ErrorCode enum', () => {
    it('should have correct error code values', () => {
      expect(ErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND');
      expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
      expect(ErrorCode.PROCESS_START_FAILED).toBe('PROCESS_START_FAILED');
      expect(ErrorCode.TASK_COMPLETION_FAILED).toBe('TASK_COMPLETION_FAILED');
      expect(ErrorCode.UNAUTHORIZED_ACCESS).toBe('UNAUTHORIZED_ACCESS');
      expect(ErrorCode.INVALID_REQUEST).toBe('INVALID_REQUEST');
      expect(ErrorCode.SERVICE_UNAVAILABLE).toBe('SERVICE_UNAVAILABLE');
    });
  });

  describe('ResponseBuilder', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('success', () => {
      it('should create successful response with data', () => {
        const data = { test: 'value' };
        const response = responseBuilder.success(mockRequest, data);

        expect(response.status).toBe(HttpStatusCode.OK);
        expect(response.headers).toEqual({ 'Content-Type': 'application/json' });
        expect(response.jsonBody.success).toBe(true);
        expect(response.jsonBody.data).toEqual(data);
        expect(response.jsonBody.timestamp).toBeDefined();
        expect(response.jsonBody.path).toBe('/api/benefit/start');
        expect(response.jsonBody.method).toBe('POST');
      });

      it('should create successful response with custom status code', () => {
        const data = { test: 'value' };
        const response = responseBuilder.success(mockRequest, data, HttpStatusCode.ACCEPTED);

        expect(response.status).toBe(HttpStatusCode.ACCEPTED);
        expect(response.jsonBody.success).toBe(true);
        expect(response.jsonBody.data).toEqual(data);
      });
    });

    describe('created', () => {
      it('should create 201 response', () => {
        const data = { id: 'new-resource' };
        const response = responseBuilder.created(mockRequest, data);

        expect(response.status).toBe(HttpStatusCode.CREATED);
        expect(response.jsonBody.success).toBe(true);
        expect(response.jsonBody.data).toEqual(data);
      });
    });

    describe('noContent', () => {
      it('should create 204 response', () => {
        const response = responseBuilder.noContent(mockRequest);

        expect(response.status).toBe(HttpStatusCode.NO_CONTENT);
        expect(response.jsonBody.success).toBe(true);
        expect(response.jsonBody.data).toBeUndefined();
      });
    });

    describe('error', () => {
      it('should create error response', () => {
        const response = responseBuilder.error(
          mockRequest,
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.VALIDATION_ERROR,
          'Validation failed',
          'Field is required'
        );

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(response.jsonBody.success).toBe(false);
        expect(response.jsonBody.error).toEqual({
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Validation failed',
          details: 'Field is required',
          validationErrors: undefined
        });
      });

      it('should include validation errors', () => {
        const validationErrors: ValidationError[] = [
          { field: 'firstName', message: 'Required', code: 'REQUIRED' }
        ];

        const response = responseBuilder.error(
          mockRequest,
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.VALIDATION_ERROR,
          'Validation failed',
          undefined,
          validationErrors
        );

        expect(response.jsonBody.error?.validationErrors).toEqual(validationErrors);
      });
    });

    describe('badRequest', () => {
      it('should create 400 response with default message', () => {
        const response = responseBuilder.badRequest(mockRequest);

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(response.jsonBody.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
        expect(response.jsonBody.error?.message).toBe('Bad Request');
      });

      it('should create 400 response with custom message and validation errors', () => {
        const validationErrors: ValidationError[] = [
          { field: 'firstName', message: 'Required', code: 'REQUIRED' }
        ];

        const response = responseBuilder.badRequest(
          mockRequest,
          'Custom validation message',
          validationErrors
        );

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(response.jsonBody.error?.message).toBe('Custom validation message');
        expect(response.jsonBody.error?.validationErrors).toEqual(validationErrors);
      });
    });

    describe('notFound', () => {
      it('should create 404 response with default message', () => {
        const response = responseBuilder.notFound(mockRequest);

        expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
        expect(response.jsonBody.error?.code).toBe(ErrorCode.NOT_FOUND);
        expect(response.jsonBody.error?.message).toBe('Resource not found');
      });

      it('should create 404 response with custom message', () => {
        const response = responseBuilder.notFound(mockRequest, 'Process not found');

        expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
        expect(response.jsonBody.error?.message).toBe('Process not found');
      });
    });

    describe('internalServerError', () => {
      it('should create 500 response with default message', () => {
        const response = responseBuilder.internalServerError(mockRequest);

        expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
        expect(response.jsonBody.error?.code).toBe(ErrorCode.INTERNAL_ERROR);
        expect(response.jsonBody.error?.message).toBe('Internal server error');
      });

      it('should create 500 response with custom message and details', () => {
        const response = responseBuilder.internalServerError(
          mockRequest,
          'Database connection failed',
          'Connection timeout after 30 seconds'
        );

        expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
        expect(response.jsonBody.error?.message).toBe('Database connection failed');
        expect(response.jsonBody.error?.details).toBe('Connection timeout after 30 seconds');
      });
    });

    describe('serviceUnavailable', () => {
      it('should create 503 response with default message', () => {
        const response = responseBuilder.serviceUnavailable(mockRequest);

        expect(response.status).toBe(HttpStatusCode.SERVICE_UNAVAILABLE);
        expect(response.jsonBody.error?.code).toBe(ErrorCode.SERVICE_UNAVAILABLE);
        expect(response.jsonBody.error?.message).toBe('Service temporarily unavailable');
      });

      it('should create 503 response with custom message', () => {
        const response = responseBuilder.serviceUnavailable(
          mockRequest,
          'Camunda service is unavailable'
        );

        expect(response.jsonBody.error?.message).toBe('Camunda service is unavailable');
      });
    });

    describe('response structure validation', () => {
      it('should include timestamp in ISO format', () => {
        const response = responseBuilder.success(mockRequest, {});
        const timestamp = response.jsonBody.timestamp;
        
        expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(new Date(timestamp).toISOString()).toBe(timestamp);
      });

      it('should handle missing method gracefully', () => {
        const requestWithoutMethod = { ...mockRequest, method: undefined };
        const response = responseBuilder.success(requestWithoutMethod, {});
        
        expect(response.jsonBody.method).toBe('UNKNOWN');
      });
    });
  });
});