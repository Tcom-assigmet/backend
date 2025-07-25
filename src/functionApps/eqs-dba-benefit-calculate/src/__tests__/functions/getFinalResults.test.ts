import { HttpRequest, InvocationContext } from '@azure/functions';
import { getFinalResults } from '../../functions/getFinalResults';
import { BenefitCalculationService } from '../../services/benefitCalculationService';
import { responseBuilder } from '../../utils/helpers';
import { FinalResultResponse, MemberData, SubProcessData } from '../../models/types';

// Mock dependencies
jest.mock('../../services/benefitCalculationService');
jest.mock('../../utils/helpers');

const MockedBenefitCalculationService = BenefitCalculationService as jest.MockedClass<typeof BenefitCalculationService>;
const mockResponseBuilder = responseBuilder as jest.Mocked<typeof responseBuilder>;

describe('getFinalResults Azure Function', () => {
  let mockRequest: Partial<HttpRequest>;
  let mockContext: jest.Mocked<InvocationContext>;
  let mockBenefitService: jest.Mocked<BenefitCalculationService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock HttpRequest
    mockRequest = {
      json: jest.fn(),
      url: '/api/benefit/results/proc-123',
      method: 'GET',
      params: { processInstanceId: 'proc-123' }
    };

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
    jest.spyOn(require('../../functions/getFinalResults'), 'benefitService', 'get')
      .mockReturnValue(mockBenefitService);
  });

  describe('successful execution', () => {
    it('should successfully get final results', async () => {
      const mockFinalResults: FinalResultResponse = {
        message: 'Process completed successfully',
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        memberData: {} as MemberData,
        subProcessData: {} as SubProcessData
      };

      const mockHttpResponse = {
        status: 200,
        jsonBody: { success: true, data: mockFinalResults }
      };

      mockBenefitService.getFinalResults.mockResolvedValue(mockFinalResults);
      mockResponseBuilder.success.mockReturnValue(mockHttpResponse);

      const result = await getFinalResults(mockRequest as HttpRequest, mockContext);

      expect(mockContext.log).toHaveBeenCalledWith('Http function processed request for url "/api/benefit/results/proc-123"');
      expect(mockBenefitService.getFinalResults).toHaveBeenCalledWith('proc-123', null);
      expect(mockResponseBuilder.success).toHaveBeenCalledWith(mockRequest, mockFinalResults);
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle results with empty values', async () => {
      const mockFinalResults: FinalResultResponse = {
        message: 'Process completed with no results',
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        memberData: {} as MemberData,
        subProcessData: {} as SubProcessData
      };

      const mockHttpResponse = {
        status: 200,
        jsonBody: { success: true, data: mockFinalResults }
      };

      mockBenefitService.getFinalResults.mockResolvedValue(mockFinalResults);
      mockResponseBuilder.success.mockReturnValue(mockHttpResponse);

      const result = await getFinalResults(mockRequest as HttpRequest, mockContext);

      expect(mockBenefitService.getFinalResults).toHaveBeenCalledWith('proc-123', null);
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

      const result = await getFinalResults(mockRequest as HttpRequest, mockContext);

      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Process instance ID is required'
      );
      expect(mockBenefitService.getFinalResults).not.toHaveBeenCalled();
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle empty processInstanceId parameter', async () => {
      mockRequest.params = { processInstanceId: '' };
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Process instance ID is required' } }
      };

      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await getFinalResults(mockRequest as HttpRequest, mockContext);

      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Process instance ID is required'
      );
      expect(mockBenefitService.getFinalResults).not.toHaveBeenCalled();
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('service errors', () => {
    it('should handle process not found error', async () => {
      const error = new Error('process not found in system');
      const mockHttpResponse = {
        status: 404,
        jsonBody: { success: false, error: { message: 'Process instance not found: proc-123' } }
      };

      mockBenefitService.getFinalResults.mockRejectedValue(error);
      mockResponseBuilder.notFound.mockReturnValue(mockHttpResponse);

      const result = await getFinalResults(mockRequest as HttpRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Error in getFinalResultsEndpoint:', error);
      expect(mockResponseBuilder.notFound).toHaveBeenCalledWith(
        mockRequest,
        'Process instance not found: proc-123'
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle process not completed error', async () => {
      const error = new Error('process not completed - still running');
      const mockHttpResponse = {
        status: 400,
        jsonBody: { success: false, error: { message: 'Process is still running. Final results not yet available.' } }
      };

      mockBenefitService.getFinalResults.mockRejectedValue(error);
      mockResponseBuilder.badRequest.mockReturnValue(mockHttpResponse);

      const result = await getFinalResults(mockRequest as HttpRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Error in getFinalResultsEndpoint:', error);
      expect(mockResponseBuilder.badRequest).toHaveBeenCalledWith(
        mockRequest,
        'Process is still running. Final results not yet available.'
      );
      expect(result).toEqual(mockHttpResponse);
    });

    it('should handle generic internal server error', async () => {
      const error = new Error('Database connection failed');
      const mockHttpResponse = {
        status: 500,
        jsonBody: { success: false, error: { message: 'Failed to get final results' } }
      };

      mockBenefitService.getFinalResults.mockRejectedValue(error);
      mockResponseBuilder.internalServerError.mockReturnValue(mockHttpResponse);

      const result = await getFinalResults(mockRequest as HttpRequest, mockContext);

      expect(mockContext.error).toHaveBeenCalledWith('Error in getFinalResultsEndpoint:', error);
      expect(mockResponseBuilder.internalServerError).toHaveBeenCalledWith(
        mockRequest,
        'Failed to get final results',
        error.message
      );
      expect(result).toEqual(mockHttpResponse);
    });
  });

  describe('API contract', () => {
    it('should always call getFinalResults with null as second parameter', async () => {
      const mockFinalResults: FinalResultResponse = {
        message: 'Process completed successfully',
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        memberData: {} as MemberData,
        subProcessData: {} as SubProcessData
      };

      mockBenefitService.getFinalResults.mockResolvedValue(mockFinalResults);
      mockResponseBuilder.success.mockReturnValue({
        status: 200,
        jsonBody: { success: true, data: mockFinalResults }
      });

      await getFinalResults(mockRequest as HttpRequest, mockContext);

      // Verify the service is called with the exact parameters expected
      expect(mockBenefitService.getFinalResults).toHaveBeenCalledWith('proc-123', null);
      expect(mockBenefitService.getFinalResults).toHaveBeenCalledTimes(1);
    });
  });
});