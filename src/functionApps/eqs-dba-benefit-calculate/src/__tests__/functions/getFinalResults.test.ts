import { getFinalResults } from '../../functions/getFinalResults';
import { BenefitCalculationService } from '../../services/benefitCalculationService';
import { HttpRequest, InvocationContext } from '@azure/functions';
import { 
  createTestHttpRequest, 
  createTestInvocationContext,
  createMockRequestWithParams,
  mockFinalResultResponse
} from '../testFixtures';

// Mock the services
jest.mock('../../services/benefitCalculationService');

describe('getFinalResults Function', () => {
  let mockRequest: HttpRequest;
  let mockContext: jest.Mocked<InvocationContext>;
  let mockBenefitService: jest.Mocked<BenefitCalculationService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = createTestHttpRequest({
      method: 'GET',
      url: '/api/benefit/results/{processInstanceId}'
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
    it('should successfully get final results', async () => {
      const processInstanceId = 'proc-123';

      // Create request with params
      mockRequest = createMockRequestWithParams({ processInstanceId });
      
      // Setup mocks
      mockBenefitService.getFinalResults.mockResolvedValue(mockFinalResultResponse);

      // Execute function
      const result = await getFinalResults(mockRequest, mockContext);

      // Verify results
      expect(result.status).toBe(200);
      expect(result.jsonBody).toEqual({
        success: true,
        message: 'Final results retrieved successfully',
        data: mockFinalResultResponse
      });

      // Verify service calls - getFinalResults expects 2 parameters
      expect(mockBenefitService.getFinalResults).toHaveBeenCalledWith(processInstanceId, null);
    });
  });

  describe('validation errors', () => {
    it('should handle missing processInstanceId parameter', async () => {
      // Create request without params
      mockRequest = createMockRequestWithParams({});

      const result = await getFinalResults(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody).toEqual({
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameter: processInstanceId',
        details: ['processInstanceId parameter is required']
      });

      expect(mockBenefitService.getFinalResults).not.toHaveBeenCalled();
    });

    it('should handle empty processInstanceId parameter', async () => {
      mockRequest = createMockRequestWithParams({ processInstanceId: '' });

      const result = await getFinalResults(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody).toEqual({
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameter: processInstanceId',
        details: ['processInstanceId parameter is required']
      });

      expect(mockBenefitService.getFinalResults).not.toHaveBeenCalled();
    });
  });

  describe('service errors', () => {
    const validProcessInstanceId = 'proc-123';

    beforeEach(() => {
      mockRequest = createMockRequestWithParams({ processInstanceId: validProcessInstanceId });
    });

    it('should handle process not found errors', async () => {
      const processNotFoundError = new Error('process not found');
      mockBenefitService.getFinalResults.mockRejectedValue(processNotFoundError);

      const result = await getFinalResults(mockRequest, mockContext);

      expect(result.status).toBe(404);
      expect(result.jsonBody).toEqual({
        error: 'PROCESS_NOT_FOUND',
        message: 'Process instance not found',
        details: ['process not found']
      });
    });

    it('should handle process not completed errors', async () => {
      const processNotCompletedError = new Error('process not completed');
      mockBenefitService.getFinalResults.mockRejectedValue(processNotCompletedError);

      const result = await getFinalResults(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody).toEqual({
        error: 'PROCESS_NOT_COMPLETED',
        message: 'Process is not yet completed',
        details: ['process not completed']
      });
    });

    it('should handle generic internal server errors', async () => {
      const genericError = new Error('Database connection failed');
      mockBenefitService.getFinalResults.mockRejectedValue(genericError);

      const result = await getFinalResults(mockRequest, mockContext);

      expect(result.status).toBe(500);
      expect(result.jsonBody).toEqual({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        details: ['Database connection failed']
      });
    });
  });

  describe('edge cases', () => {
    it('should handle very long processInstanceId', async () => {
      const longProcessId = 'proc-' + 'a'.repeat(1000);
      mockRequest = createMockRequestWithParams({ processInstanceId: longProcessId });

      mockBenefitService.getFinalResults.mockResolvedValue(mockFinalResultResponse);

      const result = await getFinalResults(mockRequest, mockContext);

      expect(result.status).toBe(200);
      expect(mockBenefitService.getFinalResults).toHaveBeenCalledWith(longProcessId, null);
    });

    it('should handle processInstanceId with special characters', async () => {
      const specialProcessId = 'proc-123_test-id!@#$%';
      mockRequest = createMockRequestWithParams({ processInstanceId: specialProcessId });

      mockBenefitService.getFinalResults.mockResolvedValue(mockFinalResultResponse);

      const result = await getFinalResults(mockRequest, mockContext);

      expect(result.status).toBe(200);
      expect(mockBenefitService.getFinalResults).toHaveBeenCalledWith(specialProcessId, null);
    });

    it('should handle empty member data', async () => {
      const processInstanceId = 'proc-123';
      mockRequest = createMockRequestWithParams({ processInstanceId });

      const emptyResultResponse = {
        ...mockFinalResultResponse,
        memberData: {} as any,
        subProcessData: {} as any
      };

      mockBenefitService.getFinalResults.mockResolvedValue(emptyResultResponse);

      const result = await getFinalResults(mockRequest, mockContext);

      expect(result.status).toBe(200);
      expect(result.jsonBody.data).toEqual(emptyResultResponse);
    });

    it('should handle null taskId', async () => {
      const processInstanceId = 'proc-123';
      mockRequest = createMockRequestWithParams({ processInstanceId });

      const nullTaskIdResponse = {
        ...mockFinalResultResponse,
        taskId: null
      };

      mockBenefitService.getFinalResults.mockResolvedValue(nullTaskIdResponse);

      const result = await getFinalResults(mockRequest, mockContext);

      expect(result.status).toBe(200);
      expect(result.jsonBody.data.taskId).toBeNull();
    });
  });
});