import { HttpRequest, InvocationContext } from '@azure/functions';
import { completeTask } from '../../functions/completeTask';
import { BenefitCalculationService } from '../../services/benefitCalculationService';
import { responseBuilder } from '../../utils/helpers';
import { CompleteTaskRequest, FinalResultResponse, MemberData, SubProcessData } from '../../models/types';
import { createMockHttpRequest, createMockInvocationContext } from '../testUtils';

// Mock dependencies
jest.mock('../../services/benefitCalculationService');
jest.mock('../../utils/helpers');

const MockedBenefitCalculationService = BenefitCalculationService as jest.MockedClass<typeof BenefitCalculationService>;
const mockResponseBuilder = responseBuilder as jest.Mocked<typeof responseBuilder>;

describe('completeTask Azure Function', () => {
  let mockRequest: HttpRequest;
  let mockContext: jest.Mocked<InvocationContext>;
  let mockBenefitService: jest.Mocked<BenefitCalculationService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock HTTP request using utility
    mockRequest = createMockHttpRequest({
      url: '/api/benefit/complete',
      method: 'POST'
    });

    // Create mock invocation context using utility
    mockContext = createMockInvocationContext();

    // Mock BenefitCalculationService instance
    mockBenefitService = new MockedBenefitCalculationService() as jest.Mocked<BenefitCalculationService>;
    
    // Replace the global instance
    jest.spyOn(require('../../functions/completeTask'), 'benefitService', 'get')
      .mockReturnValue(mockBenefitService);
  });

  const validRequestBody: CompleteTaskRequest = {
    processInstanceId: 'proc-123',
    variables: {
      salary: { value: 50000, type: 'Double' },
      yearsOfService: { value: 10, type: 'Long' }
    }
  };

  describe('successful execution', () => {
    it('should successfully complete task', async () => {
      const mockResponse: FinalResultResponse = {
        message: 'Task completed successfully',
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        memberData: {} as MemberData,
        subProcessData: {} as SubProcessData
      };

      const mockHttpResponse = {
        status: 200,
        jsonBody: { success: true, data: mockResponse }
      };

      mockRequest.json.mockResolvedValue(validRequestBody);
      mockBenefitService.completeTask.mockResolvedValue(mockResponse);
      mockResponseBuilder.success.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockContext.log).toHaveBeenCalledWith('Http function processed request for url "/api/benefit/complete"');
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockBenefitService.completeTask).toHaveBeenCalledWith(validRequestBody);
      expect(mockResponseBuilder.success).toHaveBeenCalledWith(mockRequest, mockResponse);
      expect(mockContext.log).toHaveBeenCalledWith('Task completed successfully:', {
        processInstanceId: mockResponse.processInstanceId,
        taskId: mockResponse.taskId
      });
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle completion with empty variables', async () => {
      const requestWithEmptyVars: CompleteTaskRequest = {
        processInstanceId: 'proc-123',
        variables: {}
      };

      const mockResponse: FinalResultResponse = {
        message: 'Task completed successfully',
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        memberData: {} as MemberData,
        subProcessData: {} as SubProcessData
      };

      const mockHttpResponse = {
        status: 200,
        jsonBody: { success: true, data: mockResponse }
      };

      mockRequest.json.mockResolvedValue(requestWithEmptyVars);
      mockBenefitService.completeTask.mockResolvedValue(mockResponse);
      mockResponseBuilder.success.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockBenefitService.completeTask).toHaveBeenCalledWith(requestWithEmptyVars);
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('request parsing errors', () => {
    it('should handle JSON parsing errors', async () => {
      const parseError = new Error('Invalid JSON');
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Invalid JSON in request body' } }
      };

      mockRequest.json.mockRejectedValue(parseError);
      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Failed to parse request body:', parseError);
      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Invalid JSON in request body'
      );
      expect(mockBenefitService.completeTask).not.toHaveBeenCalled();
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle malformed JSON', async () => {
      const parseError = new SyntaxError('Unexpected token');
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Invalid JSON in request body' } }
      };

      mockRequest.json.mockRejectedValue(parseError);
      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Failed to parse request body:', parseError);
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('validation errors', () => {
    it('should handle missing processInstanceId', async () => {
      const invalidRequest = { ...validRequestBody, processInstanceId: '' };
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Process instance ID is required' } }
      };

      mockRequest.json.mockResolvedValue(invalidRequest);
      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Process instance ID is required'
      );
      expect(mockBenefitService.completeTask).not.toHaveBeenCalled();
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle undefined processInstanceId', async () => {
      const invalidRequest = { ...validRequestBody, processInstanceId: undefined as any };
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Process instance ID is required' } }
      };

      mockRequest.json.mockResolvedValue(invalidRequest);
      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Process instance ID is required'
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle null processInstanceId', async () => {
      const invalidRequest = { ...validRequestBody, processInstanceId: null as any };
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Process instance ID is required' } }
      };

      mockRequest.json.mockResolvedValue(invalidRequest);
      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Process instance ID is required'
      );
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('service errors', () => {
    beforeEach(() => {
      mockRequest.json.mockResolvedValue(validRequestBody);
    });

    it('should handle task not found error', async () => {
      const error = new Error('Failed to get task ID - task not found');
      const mockHttpResponse = {
        status: 404,
        jsonBody: { success: false, error: { message: 'Task not found or already completed' } }
      };

      mockBenefitService.completeTask.mockRejectedValue(error);
      mockResponseBuilder.notFound.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Error in completeTask:', error);
      expect(mockResponseBuilder.notFound).toHaveBeenCalledWith(
        mockRequest,
        'Task not found or already completed'
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle invalid variables error', async () => {
      const error = new Error('invalid variables provided to task');
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Invalid task variables provided' } }
      };

      mockBenefitService.completeTask.mockRejectedValue(error);
      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Error in completeTask:', error);
      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Invalid task variables provided'
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle generic internal server error', async () => {
      const error = new Error('Database connection failed');
      const mockHttpResponse = {
        status: 500,
        jsonBody: { success: false, error: { message: 'Failed to complete task' } }
      };

      mockBenefitService.completeTask.mockRejectedValue(error);
      mockResponseBuilder.internalServerError.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Error in completeTask:', error);
      expect(mockResponseBuilder.internalServerError).toHaveBeenCalledWith(
        mockRequest,
        'Failed to complete task',
        error.message
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle error without message', async () => {
      const error = new Error();
      const mockHttpResponse = {
        status: 500,
        jsonBody: { success: false, error: { message: 'Failed to complete task' } }
      };

      mockBenefitService.completeTask.mockRejectedValue(error);
      mockResponseBuilder.internalServerError.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockResponseBuilder.internalServerError).toHaveBeenCalledWith(
        mockRequest,
        'Failed to complete task',
        ''
      );
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('edge cases', () => {
    it('should handle empty request body', async () => {
      const emptyBody = {} as CompleteTaskRequest;
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Process instance ID is required' } }
      };

      mockRequest.json.mockResolvedValue(emptyBody);
      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Process instance ID is required'
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle request with additional properties', async () => {
      const requestWithExtra = {
        ...validRequestBody,
        extraProperty: 'should be ignored'
      };

      const mockResponse: FinalResultResponse = {
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        results: [],
        status: 'completed'
      };

      const mockHttpResponse = {
        status: 200,
        jsonBody: { success: true, data: mockResponse }
      };

      mockRequest.json.mockResolvedValue(requestWithExtra);
      mockBenefitService.completeTask.mockResolvedValue(mockResponse);
      mockResponseBuilder.success.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockBenefitService.completeTask).toHaveBeenCalledWith(requestWithExtra);
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle complex variable types', async () => {
      const complexRequest: CompleteTaskRequest = {
        processInstanceId: 'proc-123',
        variables: {
          stringVar: { value: 'test', type: 'String' },
          numberVar: { value: 123.45, type: 'Double' },
          booleanVar: { value: true, type: 'Boolean' },
          dateVar: { value: new Date('2024-01-01'), type: 'Date' },
          longVar: { value: 1000000, type: 'Long' }
        }
      };

      const mockResponse: FinalResultResponse = {
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        results: [],
        status: 'completed'
      };

      const mockHttpResponse = {
        status: 200,
        jsonBody: { success: true, data: mockResponse }
      };

      mockRequest.json.mockResolvedValue(complexRequest);
      mockBenefitService.completeTask.mockResolvedValue(mockResponse);
      mockResponseBuilder.success.mockReturnValue(mockHttpResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(mockBenefitService.completeTask).toHaveBeenCalledWith(complexRequest);
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('logging', () => {
    it('should log request processing', async () => {
      mockRequest.json.mockResolvedValue(validRequestBody);
      mockBenefitService.completeTask.mockResolvedValue({
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        results: [],
        status: 'completed'
      });
      mockResponseBuilder.success.mockReturnValue({
        status: 200,
        jsonBody: { success: true, data: {} }
      });

      await completeTask(mockRequest, mockContext);

      expect(mockContext.log).toHaveBeenCalledWith('Http function processed request for url "/api/benefit/complete"');
    });

    it('should log successful completion with details', async () => {
      const mockResponse: FinalResultResponse = {
        processInstanceId: 'proc-789',
        taskId: 'task-123',
        results: [],
        status: 'completed'
      };

      mockRequest.json.mockResolvedValue(validRequestBody);
      mockBenefitService.completeTask.mockResolvedValue(mockResponse);
      mockResponseBuilder.success.mockReturnValue({
        status: 200,
        jsonBody: { success: true, data: mockResponse }
      });

      await completeTask(mockRequest, mockContext);

      expect(mockContext.log).toHaveBeenCalledWith('Task completed successfully:', {
        processInstanceId: 'proc-789',
        taskId: 'task-123'
      });
    });
  });
});