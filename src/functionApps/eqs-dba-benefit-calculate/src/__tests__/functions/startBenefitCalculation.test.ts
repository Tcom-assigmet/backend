import { HttpRequest, InvocationContext } from '@azure/functions';
import { startBenefitCalculation } from '../../functions/startBenefitCalculation';
import { BenefitCalculationService } from '../../services/benefitCalculationService';
import { validationService } from '../../utils/validation';
import { responseBuilder } from '../../utils/helpers';
import { StartProcessRequest, ProcessResponse, ValidationError } from '../../models/types';

// Mock dependencies
jest.mock('../../services/benefitCalculationService');
jest.mock('../../utils/validation');
jest.mock('../../utils/helpers');

const MockedBenefitCalculationService = BenefitCalculationService as jest.MockedClass<typeof BenefitCalculationService>;
const mockValidationService = validationService as jest.Mocked<typeof validationService>;
const mockResponseBuilder = responseBuilder as jest.Mocked<typeof responseBuilder>;

describe('startBenefitCalculation Azure Function', () => {
  let mockRequest: jest.Mocked<HttpRequest>;
  let mockContext: jest.Mocked<InvocationContext>;
  let mockBenefitService: jest.Mocked<BenefitCalculationService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock HttpRequest
    mockRequest = {
      json: jest.fn(),
      url: '/api/benefit/start',
      method: 'POST',
      headers: {},
      query: {},
      params: {},
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
    jest.spyOn(require('../../functions/startBenefitCalculation'), 'benefitService', 'get')
      .mockReturnValue(mockBenefitService);
  });

  const validRequestBody: StartProcessRequest = {
    firstName: 'John',
    lastName: 'Doe',
    memberId: 'MEM123',
    dateOfBirth: '1990-01-01',
    dateJoinedFund: '2020-01-01',
    effectiveDate: '2024-01-01',
    calculationDate: '2024-01-01',
    benefitClass: 'Standard',
    paymentType: 'Monthly',
    planNumber: 'PLAN001',
    paymentTypeDesc: 'Monthly Payment'
  };

  describe('successful execution', () => {
    it('should successfully start benefit calculation', async () => {
      const mockResponse: ProcessResponse = {
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        requiredFields: [
          { name: 'salary', type: 'number', required: true }
        ]
      };

      const mockHttpResponse = {
        status: 201,
        jsonBody: { success: true, data: mockResponse }
      };

      mockRequest.json.mockResolvedValue(validRequestBody);
      mockValidationService.validateStartProcessRequest.mockReturnValue([]);
      mockBenefitService.startBenefitCalculation.mockResolvedValue(mockResponse);
      mockResponseBuilder.created.mockReturnValue(mockHttpResponse);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockValidationService.validateStartProcessRequest).toHaveBeenCalledWith(validRequestBody);
      expect(mockBenefitService.startBenefitCalculation).toHaveBeenCalledWith(validRequestBody);
      expect(mockResponseBuilder.created).toHaveBeenCalledWith(mockRequest, mockResponse);
      expect(mockContext.log).toHaveBeenCalledWith('Benefit calculation started successfully:', {
        processInstanceId: mockResponse.processInstanceId,
        taskId: mockResponse.taskId
      });
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

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Failed to parse request body:', parseError);
      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Invalid JSON in request body'
      );
      expect(mockValidationService.validateStartProcessRequest).not.toHaveBeenCalled();
      expect(mockBenefitService.startBenefitCalculation).not.toHaveBeenCalled();
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('validation errors', () => {
    it('should handle validation errors', async () => {
      const validationErrors: ValidationError[] = [
        { field: 'firstName', message: 'First name is required', code: 'REQUIRED' },
        { field: 'dateOfBirth', message: 'Invalid date format', code: 'INVALID_FORMAT' }
      ];

      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Validation failed', validationErrors } }
      };

      mockRequest.json.mockResolvedValue(validRequestBody);
      mockValidationService.validateStartProcessRequest.mockReturnValue(validationErrors);
      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(mockValidationService.validateStartProcessRequest).toHaveBeenCalledWith(validRequestBody);
      expect(mockContext.warn).toHaveBeenCalledWith('Validation failed:', validationErrors);
      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Validation failed',
        validationErrors
      );
      expect(mockBenefitService.startBenefitCalculation).not.toHaveBeenCalled();
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle single validation error', async () => {
      const validationErrors: ValidationError[] = [
        { field: 'memberId', message: 'Member ID is required', code: 'REQUIRED' }
      ];

      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Validation failed', validationErrors } }
      };

      mockRequest.json.mockResolvedValue({ ...validRequestBody, memberId: '' });
      mockValidationService.validateStartProcessRequest.mockReturnValue(validationErrors);
      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(mockValidationService.validateStartProcessRequest).toHaveBeenCalled();
      expect(mockContext.warn).toHaveBeenCalledWith('Validation failed:', validationErrors);
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('service errors', () => {
    beforeEach(() => {
      mockRequest.json.mockResolvedValue(validRequestBody);
      mockValidationService.validateStartProcessRequest.mockReturnValue([]);
    });

    it('should handle process not found error', async () => {
      const error = new Error('process not found in Camunda');
      const mockHttpResponse = {
        status: 404,
        jsonBody: { success: false, error: { message: 'Process definition not found' } }
      };

      mockBenefitService.startBenefitCalculation.mockRejectedValue(error);
      mockResponseBuilder.notFound.mockReturnValue(mockHttpResponse);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Error in startBenefitCalculation:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      expect(mockResponseBuilder.notFound).toHaveBeenCalledWith(
        mockRequest,
        'Process definition not found'
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle service unavailable error', async () => {
      const error = new Error('service unavailable - Camunda is down');
      const mockHttpResponse = {
        status: 503,
        jsonBody: { success: false, error: { message: 'Camunda service is currently unavailable' } }
      };

      mockBenefitService.startBenefitCalculation.mockRejectedValue(error);
      mockResponseBuilder.serviceUnavailable.mockReturnValue(mockHttpResponse);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Error in startBenefitCalculation:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      expect(mockResponseBuilder.serviceUnavailable).toHaveBeenCalledWith(
        mockRequest,
        'Camunda service is currently unavailable'
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle generic internal server error', async () => {
      const error = new Error('Database connection failed');
      const mockHttpResponse = {
        status: 500,
        jsonBody: { success: false, error: { message: 'Failed to start benefit calculation process' } }
      };

      mockBenefitService.startBenefitCalculation.mockRejectedValue(error);
      mockResponseBuilder.internalServerError.mockReturnValue(mockHttpResponse);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Error in startBenefitCalculation:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      expect(mockResponseBuilder.internalServerError).toHaveBeenCalledWith(
        mockRequest,
        'Failed to start benefit calculation process',
        error.message
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle error without message', async () => {
      const error = new Error();
      const mockHttpResponse = {
        status: 500,
        jsonBody: { success: false, error: { message: 'Failed to start benefit calculation process' } }
      };

      mockBenefitService.startBenefitCalculation.mockRejectedValue(error);
      mockResponseBuilder.internalServerError.mockReturnValue(mockHttpResponse);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(mockResponseBuilder.internalServerError).toHaveBeenCalledWith(
        mockRequest,
        'Failed to start benefit calculation process',
        ''
      );
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('edge cases', () => {
    it('should handle empty request body', async () => {
      const emptyBody = {} as StartProcessRequest;
      const validationErrors: ValidationError[] = [
        { field: 'firstName', message: 'First name is required', code: 'REQUIRED' },
        { field: 'lastName', message: 'Last name is required', code: 'REQUIRED' }
      ];

      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Validation failed', validationErrors } }
      };

      mockRequest.json.mockResolvedValue(emptyBody);
      mockValidationService.validateStartProcessRequest.mockReturnValue(validationErrors);
      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(mockValidationService.validateStartProcessRequest).toHaveBeenCalledWith(emptyBody);
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle null request body', async () => {
      const parseError = new TypeError('Cannot read properties of null');
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Invalid JSON in request body' } }
      };

      mockRequest.json.mockRejectedValue(parseError);
      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Failed to parse request body:', parseError);
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      const mockHttpResponse = {
        status: 500,
        jsonBody: { success: false, error: { message: 'Failed to start benefit calculation process' } }
      };

      mockRequest.json.mockResolvedValue(validRequestBody);
      mockValidationService.validateStartProcessRequest.mockReturnValue([]);
      mockBenefitService.startBenefitCalculation.mockRejectedValue(timeoutError);
      mockResponseBuilder.internalServerError.mockReturnValue(mockHttpResponse);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('response logging', () => {
    it('should log successful process start with details', async () => {
      const mockResponse: ProcessResponse = {
        processInstanceId: 'proc-789',
        taskId: 'task-123',
        requiredFields: []
      };

      mockRequest.json.mockResolvedValue(validRequestBody);
      mockValidationService.validateStartProcessRequest.mockReturnValue([]);
      mockBenefitService.startBenefitCalculation.mockResolvedValue(mockResponse);
      mockResponseBuilder.created.mockReturnValue({
        status: 201,
        jsonBody: { success: true, data: mockResponse }
      });

      await startBenefitCalculation(mockRequest, mockContext);

      expect(mockContext.log).toHaveBeenCalledWith('Benefit calculation started successfully:', {
        processInstanceId: 'proc-789',
        taskId: 'task-123'
      });
    });
  });
});