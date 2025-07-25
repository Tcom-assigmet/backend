import { HttpRequest, InvocationContext } from '@azure/functions';
import { getTaskDetails } from '../../functions/getTaskDetails';
import { BenefitCalculationService } from '../../services/benefitCalculationService';
import { responseBuilder } from '../../utils/helpers';
import { RequiredField } from '../../models/types';

// Mock dependencies
jest.mock('../../services/benefitCalculationService');
jest.mock('../../utils/helpers');

const MockedBenefitCalculationService = BenefitCalculationService as jest.MockedClass<typeof BenefitCalculationService>;
const mockResponseBuilder = responseBuilder as jest.Mocked<typeof responseBuilder>;

describe('getTaskDetails Azure Function', () => {
  let mockRequest: jest.Mocked<HttpRequest>;
  let mockContext: jest.Mocked<InvocationContext>;
  let mockBenefitService: jest.Mocked<BenefitCalculationService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock HttpRequest
    mockRequest = {
      json: jest.fn(),
      url: '/api/benefit/task/proc-123',
      method: 'GET',
      headers: {},
      query: {},
      params: { processInstanceId: 'proc-123' },
      text: jest.fn(),
      arrayBuffer: jest.fn(),
      formData: jest.fn()
    } as jest.Mocked<HttpRequest>;

    // Mock InvocationContext
    mockContext = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn()
    } as unknown as jest.Mocked<InvocationContext>;

    // Mock BenefitCalculationService instance
    mockBenefitService = new MockedBenefitCalculationService() as jest.Mocked<BenefitCalculationService>;
    
    // Replace the global instance
    jest.spyOn(require('../../functions/getTaskDetails'), 'benefitService', 'get')
      .mockReturnValue(mockBenefitService);
  });

  describe('successful execution', () => {
    it('should successfully get task details', async () => {
      const mockRequiredFields: RequiredField[] = [
        { name: 'salary', type: 'number', required: true },
        { name: 'yearsOfService', type: 'number', required: true },
        { name: 'department', type: 'string', required: false }
      ];

      const mockTaskDetails = {
        taskId: 'task-456',
        requiredFields: mockRequiredFields
      };

      const mockHttpResponse = {
        status: 200,
        jsonBody: { success: true, data: mockTaskDetails }
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(mockTaskDetails);
      mockResponseBuilder.success.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockContext.log).toHaveBeenCalledWith('Http function processed request for url "/api/benefit/task/proc-123"');
      expect(mockBenefitService.getTaskDetails).toHaveBeenCalledWith('proc-123');
      expect(mockResponseBuilder.success).toHaveBeenCalledWith(mockRequest, mockTaskDetails);
      expect(mockContext.log).toHaveBeenCalledWith('Task details retrieved successfully:', {
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        requiredFieldsCount: 3
      });
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle empty required fields', async () => {
      const mockTaskDetails = {
        taskId: 'task-789',
        requiredFields: []
      };

      const mockHttpResponse = {
        status: 200,
        jsonBody: { success: true, data: mockTaskDetails }
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(mockTaskDetails);
      mockResponseBuilder.success.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockBenefitService.getTaskDetails).toHaveBeenCalledWith('proc-123');
      expect(mockContext.log).toHaveBeenCalledWith('Task details retrieved successfully:', {
        processInstanceId: 'proc-123',
        taskId: 'task-789',
        requiredFieldsCount: 0
      });
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('parameter validation', () => {
    it('should handle missing processInstanceId parameter', async () => {
      mockRequest.params = {};
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Process instance ID is required' } }
      };

      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Process instance ID is required'
      );
      expect(mockBenefitService.getTaskDetails).not.toHaveBeenCalled();
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle empty processInstanceId parameter', async () => {
      mockRequest.params = { processInstanceId: '' };
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Process instance ID is required' } }
      };

      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Process instance ID is required'
      );
      expect(mockBenefitService.getTaskDetails).not.toHaveBeenCalled();
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle null processInstanceId parameter', async () => {
      mockRequest.params = { processInstanceId: null as any };
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Process instance ID is required' } }
      };

      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Process instance ID is required'
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle undefined processInstanceId parameter', async () => {
      mockRequest.params = { processInstanceId: undefined };
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Process instance ID is required' } }
      };

      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Process instance ID is required'
      );
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('task not found scenarios', () => {
    it('should handle no active tasks found', async () => {
      const mockTaskDetails = {
        taskId: '',
        requiredFields: []
      };

      const mockHttpResponse = {
        status: 404,
        jsonBody: { success: false, error: { message: 'No active tasks found for process instance: proc-123' } }
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(mockTaskDetails);
      mockResponseBuilder.notFound.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockBenefitService.getTaskDetails).toHaveBeenCalledWith('proc-123');
      expect(mockResponseBuilder.notFound).toHaveBeenCalledWith(
        mockRequest,
        'No active tasks found for process instance: proc-123'
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle null taskId', async () => {
      const mockTaskDetails = {
        taskId: null as any,
        requiredFields: []
      };

      const mockHttpResponse = {
        status: 404,
        jsonBody: { success: false, error: { message: 'No active tasks found for process instance: proc-123' } }
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(mockTaskDetails);
      mockResponseBuilder.notFound.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockResponseBuilder.notFound).toHaveBeenCalledWith(
        mockRequest,
        'No active tasks found for process instance: proc-123'
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle undefined taskId', async () => {
      const mockTaskDetails = {
        taskId: undefined as any,
        requiredFields: []
      };

      const mockHttpResponse = {
        status: 404,
        jsonBody: { success: false, error: { message: 'No active tasks found for process instance: proc-123' } }
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(mockTaskDetails);
      mockResponseBuilder.notFound.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockResponseBuilder.notFound).toHaveBeenCalledWith(
        mockRequest,
        'No active tasks found for process instance: proc-123'
      );
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('service errors', () => {
    it('should handle process not found error', async () => {
      const error = new Error('Process instance not found in Camunda');
      const mockHttpResponse = {
        status: 404,
        jsonBody: { success: false, error: { message: 'Process instance not found' } }
      };

      mockBenefitService.getTaskDetails.mockRejectedValue(error);
      mockResponseBuilder.notFound.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Error in getTaskDetails:', error);
      expect(mockResponseBuilder.notFound).toHaveBeenCalledWith(
        mockRequest,
        'Process instance not found'
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle generic internal server error', async () => {
      const error = new Error('Database connection failed');
      const mockHttpResponse = {
        status: 500,
        jsonBody: { success: false, error: { message: 'Failed to get task details' } }
      };

      mockBenefitService.getTaskDetails.mockRejectedValue(error);
      mockResponseBuilder.internalServerError.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Error in getTaskDetails:', error);
      expect(mockResponseBuilder.internalServerError).toHaveBeenCalledWith(
        mockRequest,
        'Failed to get task details',
        error.message
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle error without message', async () => {
      const error = new Error();
      const mockHttpResponse = {
        status: 500,
        jsonBody: { success: false, error: { message: 'Failed to get task details' } }
      };

      mockBenefitService.getTaskDetails.mockRejectedValue(error);
      mockResponseBuilder.internalServerError.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockResponseBuilder.internalServerError).toHaveBeenCalledWith(
        mockRequest,
        'Failed to get task details',
        ''
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout while getting task details');
      const mockHttpResponse = {
        status: 500,
        jsonBody: { success: false, error: { message: 'Failed to get task details' } }
      };

      mockBenefitService.getTaskDetails.mockRejectedValue(timeoutError);
      mockResponseBuilder.internalServerError.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('edge cases', () => {
    it('should handle very long processInstanceId', async () => {
      const longProcessId = 'a'.repeat(1000);
      mockRequest.params = { processInstanceId: longProcessId };

      const mockTaskDetails = {
        taskId: 'task-123',
        requiredFields: []
      };

      const mockHttpResponse = {
        status: 200,
        jsonBody: { success: true, data: mockTaskDetails }
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(mockTaskDetails);
      mockResponseBuilder.success.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockBenefitService.getTaskDetails).toHaveBeenCalledWith(longProcessId);
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle special characters in processInstanceId', async () => {
      const specialProcessId = 'proc-123-$@#%';
      mockRequest.params = { processInstanceId: specialProcessId };

      const mockTaskDetails = {
        taskId: 'task-123',
        requiredFields: []
      };

      const mockHttpResponse = {
        status: 200,
        jsonBody: { success: true, data: mockTaskDetails }
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(mockTaskDetails);
      mockResponseBuilder.success.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockBenefitService.getTaskDetails).toHaveBeenCalledWith(specialProcessId);
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle many required fields', async () => {
      const manyFields: RequiredField[] = Array.from({ length: 50 }, (_, i) => ({
        name: `field${i}`,
        type: 'string',
        required: i % 2 === 0
      }));

      const mockTaskDetails = {
        taskId: 'task-123',
        requiredFields: manyFields
      };

      const mockHttpResponse = {
        status: 200,
        jsonBody: { success: true, data: mockTaskDetails }
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(mockTaskDetails);
      mockResponseBuilder.success.mockReturnValue(mockHttpResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(mockContext.log).toHaveBeenCalledWith('Task details retrieved successfully:', {
        processInstanceId: 'proc-123',
        taskId: 'task-123',
        requiredFieldsCount: 50
      });
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('logging', () => {
    it('should log request processing', async () => {
      const mockTaskDetails = {
        taskId: 'task-123',
        requiredFields: []
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(mockTaskDetails);
      mockResponseBuilder.success.mockReturnValue({
        status: 200,
        jsonBody: { success: true, data: mockTaskDetails }
      });

      await getTaskDetails(mockRequest, mockContext);

      expect(mockContext.log).toHaveBeenCalledWith('Http function processed request for url "/api/benefit/task/proc-123"');
    });

    it('should log successful retrieval with details', async () => {
      const mockTaskDetails = {
        taskId: 'task-789',
        requiredFields: [
          { name: 'field1', type: 'string', required: true },
          { name: 'field2', type: 'number', required: false }
        ]
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(mockTaskDetails);
      mockResponseBuilder.success.mockReturnValue({
        status: 200,
        jsonBody: { success: true, data: mockTaskDetails }
      });

      await getTaskDetails(mockRequest, mockContext);

      expect(mockContext.log).toHaveBeenCalledWith('Task details retrieved successfully:', {
        processInstanceId: 'proc-123',
        taskId: 'task-789',
        requiredFieldsCount: 2
      });
    });
  });
});