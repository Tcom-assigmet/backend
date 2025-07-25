import { getTaskDetails } from '../../functions/getTaskDetails';
import { BenefitCalculationService } from '../../services/benefitCalculationService';
import { HttpRequest, InvocationContext } from '@azure/functions';
import { 
  createTestHttpRequest, 
  createTestInvocationContext,
  createMockRequestWithParams,
  mockRequiredFields
} from '../testFixtures';

// Mock the services
jest.mock('../../services/benefitCalculationService');

describe('getTaskDetails Function', () => {
  let mockRequest: HttpRequest;
  let mockContext: jest.Mocked<InvocationContext>;
  let mockBenefitService: jest.Mocked<BenefitCalculationService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = createTestHttpRequest({
      method: 'GET',
      url: '/api/benefit/task/{processInstanceId}'
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
    it('should successfully get task details', async () => {
      const processInstanceId = 'proc-123';
      const expectedResponse = {
        taskId: 'task-456',
        requiredFields: mockRequiredFields
      };

      // Create request with params
      mockRequest = createMockRequestWithParams({ processInstanceId });
      
      // Setup mocks
      mockBenefitService.getTaskDetails.mockResolvedValue(expectedResponse);

      // Execute function
      const result = await getTaskDetails(mockRequest, mockContext);

      // Verify results
      expect(result.status).toBe(200);
      expect(result.jsonBody).toEqual({
        success: true,
        message: 'Task details retrieved successfully',
        data: expectedResponse
      });

      // Verify service calls
      expect(mockBenefitService.getTaskDetails).toHaveBeenCalledWith(processInstanceId);
    });
  });

  describe('validation errors', () => {
    it('should handle missing processInstanceId parameter', async () => {
      // Create request without params
      mockRequest = createMockRequestWithParams({});

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody).toEqual({
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameter: processInstanceId',
        details: ['processInstanceId parameter is required']
      });

      expect(mockBenefitService.getTaskDetails).not.toHaveBeenCalled();
    });

    it('should handle empty processInstanceId parameter', async () => {
      mockRequest = createMockRequestWithParams({ processInstanceId: '' });

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody).toEqual({
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameter: processInstanceId',
        details: ['processInstanceId parameter is required']
      });

      expect(mockBenefitService.getTaskDetails).not.toHaveBeenCalled();
    });

    it('should handle null processInstanceId parameter', async () => {
      mockRequest = createMockRequestWithParams({ processInstanceId: null });

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody.error).toBe('VALIDATION_ERROR');
      expect(mockBenefitService.getTaskDetails).not.toHaveBeenCalled();
    });

    it('should handle undefined processInstanceId parameter', async () => {
      mockRequest = createMockRequestWithParams({ processInstanceId: undefined });

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody.error).toBe('VALIDATION_ERROR');
      expect(mockBenefitService.getTaskDetails).not.toHaveBeenCalled();
    });
  });

  describe('service errors', () => {
    const validProcessInstanceId = 'proc-123';

    beforeEach(() => {
      mockRequest = createMockRequestWithParams({ processInstanceId: validProcessInstanceId });
    });

    it('should handle no active tasks found', async () => {
      const noTasksError = new Error('no active tasks found');
      mockBenefitService.getTaskDetails.mockRejectedValue(noTasksError);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(result.status).toBe(404);
      expect(result.jsonBody).toEqual({
        error: 'NO_ACTIVE_TASKS',
        message: 'No active tasks found for the process instance',
        details: ['no active tasks found']
      });
    });

    it('should handle process not found errors', async () => {
      const processNotFoundError = new Error('process not found');
      mockBenefitService.getTaskDetails.mockRejectedValue(processNotFoundError);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(result.status).toBe(404);
      expect(result.jsonBody).toEqual({
        error: 'PROCESS_NOT_FOUND',
        message: 'Process instance not found',
        details: ['process not found']
      });
    });

    it('should handle generic internal server errors', async () => {
      const genericError = new Error('Database connection failed');
      mockBenefitService.getTaskDetails.mockRejectedValue(genericError);

      const result = await getTaskDetails(mockRequest, mockContext);

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

      const expectedResponse = {
        taskId: 'task-456',
        requiredFields: mockRequiredFields
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(expectedResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(result.status).toBe(200);
      expect(mockBenefitService.getTaskDetails).toHaveBeenCalledWith(longProcessId);
    });

    it('should handle processInstanceId with special characters', async () => {
      const specialProcessId = 'proc-123_test-id!@#$%';
      mockRequest = createMockRequestWithParams({ processInstanceId: specialProcessId });

      const expectedResponse = {
        taskId: 'task-456',
        requiredFields: mockRequiredFields
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(expectedResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(result.status).toBe(200);
      expect(mockBenefitService.getTaskDetails).toHaveBeenCalledWith(specialProcessId);
    });

    it('should handle task with no required fields', async () => {
      const processInstanceId = 'proc-123';
      mockRequest = createMockRequestWithParams({ processInstanceId });

      const expectedResponse = {
        taskId: 'task-456',
        requiredFields: []
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(expectedResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(result.status).toBe(200);
      expect(result.jsonBody.data.requiredFields).toEqual([]);
    });

    it('should handle task with many required fields', async () => {
      const processInstanceId = 'proc-123';
      mockRequest = createMockRequestWithParams({ processInstanceId });

      const manyFields = Array.from({ length: 20 }, (_, i) => ({
        name: `field${i}`,
        type: 'string',
        required: i % 2 === 0
      }));

      const expectedResponse = {
        taskId: 'task-456',
        requiredFields: manyFields
      };

      mockBenefitService.getTaskDetails.mockResolvedValue(expectedResponse);

      const result = await getTaskDetails(mockRequest, mockContext);

      expect(result.status).toBe(200);
      expect(result.jsonBody.data.requiredFields).toHaveLength(20);
    });
  });
});