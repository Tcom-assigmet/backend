import { completeTask } from '../../functions/completeTask';
import { BenefitCalculationService } from '../../services/benefitCalculationService';
import { HttpRequest, InvocationContext } from '@azure/functions';
import { 
  createTestHttpRequest, 
  createTestInvocationContext,
  validCompleteTaskRequest,
  mockFinalResultResponse,
  createMockRequestWithJson
} from '../testFixtures';

// Mock the services
jest.mock('../../services/benefitCalculationService');

describe('completeTask Function', () => {
  let mockRequest: HttpRequest;
  let mockContext: jest.Mocked<InvocationContext>;
  let mockBenefitService: jest.Mocked<BenefitCalculationService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = createTestHttpRequest({
      method: 'POST',
      url: '/api/benefit/complete'
    });

    mockContext = createTestInvocationContext();

    // Create properly typed mock
    mockBenefitService = {
      startBenefitCalculation: jest.fn(),
      getTaskDetails: jest.fn(),
      completeTask: jest.fn(),
      getFinalResults: jest.fn(),
      completeTaskDirect: jest.fn()
    } as unknown as jest.Mocked<BenefitCalculationService>;

    // Mock the service constructor
    (BenefitCalculationService as jest.MockedClass<typeof BenefitCalculationService>).mockImplementation(() => mockBenefitService);
  });

  describe('successful execution', () => {
    it('should successfully complete task', async () => {
      // Setup mocks
      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(validCompleteTaskRequest);
      mockBenefitService.completeTask.mockResolvedValue(mockFinalResultResponse);

      // Execute function
      const result = await completeTask(mockRequest, mockContext);

      // Verify results
      expect(result.status).toBe(200);
      expect(result.jsonBody).toEqual({
        success: true,
        message: 'Task completed successfully',
        data: mockFinalResultResponse
      });

      // Verify service calls
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockBenefitService.completeTask).toHaveBeenCalledWith(validCompleteTaskRequest);
    });

    it('should handle empty variables object', async () => {
      const requestWithEmptyVars = {
        processInstanceId: 'proc-123',
        variables: {}
      };

      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(requestWithEmptyVars);
      mockBenefitService.completeTask.mockResolvedValue(mockFinalResultResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(result.status).toBe(200);
      expect(mockBenefitService.completeTask).toHaveBeenCalledWith(requestWithEmptyVars);
    });
  });

  describe('error handling', () => {
    it('should handle JSON parsing errors', async () => {
      const parseError = new SyntaxError('Unexpected token in JSON');
      (mockRequest.json as jest.MockedFunction<any>).mockRejectedValue(parseError);

      const result = await completeTask(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody).toEqual({
        error: 'INVALID_JSON',
        message: 'Invalid JSON in request body',
        details: ['Unexpected token in JSON']
      });

      expect(mockBenefitService.completeTask).not.toHaveBeenCalled();
    });

    it('should handle missing processInstanceId', async () => {
      const invalidRequest = {
        variables: {
          salary: { value: 50000, type: 'Double' }
        }
      };

      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(invalidRequest);

      const result = await completeTask(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody).toEqual({
        error: 'VALIDATION_ERROR',
        message: 'Missing required field: processInstanceId',
        details: ['processInstanceId is required']
      });

      expect(mockBenefitService.completeTask).not.toHaveBeenCalled();
    });

    it('should handle task not found errors', async () => {
      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(validCompleteTaskRequest);
      
      const taskNotFoundError = new Error('task not found');
      mockBenefitService.completeTask.mockRejectedValue(taskNotFoundError);

      const result = await completeTask(mockRequest, mockContext);

      expect(result.status).toBe(404);
      expect(result.jsonBody).toEqual({
        error: 'TASK_NOT_FOUND',
        message: 'Task not found',
        details: ['task not found']
      });
    });

    it('should handle invalid variables errors', async () => {
      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(validCompleteTaskRequest);
      
      const invalidVariablesError = new Error('invalid variables');
      mockBenefitService.completeTask.mockRejectedValue(invalidVariablesError);

      const result = await completeTask(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody).toEqual({
        error: 'INVALID_VARIABLES',
        message: 'Invalid task variables',
        details: ['invalid variables']
      });
    });

    it('should handle generic internal server errors', async () => {
      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(validCompleteTaskRequest);
      
      const genericError = new Error('Database connection failed');
      mockBenefitService.completeTask.mockRejectedValue(genericError);

      const result = await completeTask(mockRequest, mockContext);

      expect(result.status).toBe(500);
      expect(result.jsonBody).toEqual({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        details: ['Database connection failed']
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty request body', async () => {
      const emptyBody = {};
      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(emptyBody);

      const result = await completeTask(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody.error).toBe('VALIDATION_ERROR');
      expect(mockBenefitService.completeTask).not.toHaveBeenCalled();
    });

    it('should handle null request body', async () => {
      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(null);

      const result = await completeTask(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody.error).toBe('VALIDATION_ERROR');
      expect(mockBenefitService.completeTask).not.toHaveBeenCalled();
    });

    it('should handle extra properties in request', async () => {
      const requestWithExtra = {
        ...validCompleteTaskRequest,
        extraProperty: 'should be ignored'
      };

      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(requestWithExtra);
      mockBenefitService.completeTask.mockResolvedValue(mockFinalResultResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(result.status).toBe(200);
      expect(mockBenefitService.completeTask).toHaveBeenCalledWith(requestWithExtra);
    });

    it('should handle complex variable types', async () => {
      const complexRequest = {
        processInstanceId: 'proc-123',
        variables: {
          salary: { value: 50000, type: 'Double' },
          yearsOfService: { value: 10, type: 'Long' },
          startDate: { value: '2020-01-01', type: 'Date' },
          isActive: { value: true, type: 'Boolean' },
          department: { value: 'Engineering', type: 'String' }
        }
      };

      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(complexRequest);
      mockBenefitService.completeTask.mockResolvedValue(mockFinalResultResponse);

      const result = await completeTask(mockRequest, mockContext);

      expect(result.status).toBe(200);
      expect(mockBenefitService.completeTask).toHaveBeenCalledWith(complexRequest);
    });
  });
});