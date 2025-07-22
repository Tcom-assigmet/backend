import { BenefitCalculatorCompleteService } from '@/src/components/forms/enterCalculationDetailsForm/services/calculation-service';
import { API_ENDPOINTS } from '@/src/configs/api';
import { FormSubmissionData, BenefitCalculationResult, ApiError } from '@/src/types/api';

// Mock the base API service
jest.mock('@/src/utils/baseAPIService', () => ({
  BaseApiService: class MockBaseApiService {
    protected baseUrl: string;
    protected showAlerts: boolean;

    constructor(endpoint: string, showAlerts = true) {
      this.baseUrl = endpoint;
      this.showAlerts = showAlerts;
    }

    async makeRequest<T>(url: string, options: RequestInit): Promise<T> {
      return (global as any).mockMakeRequest(url, options);
    }
  },
  isApiError: (response: unknown) => {
    return typeof response === 'object' && response !== null && 'error' in response;
  },
  isBenefitCalculationResult: (response: unknown) => {
    return typeof response === 'object' && response !== null && 'success' in response;
  },
}));

// Mock fetch globally
const mockMakeRequest = jest.fn();
(global as any).mockMakeRequest = mockMakeRequest;

describe('BenefitCalculatorCompleteService', () => {
  let service: BenefitCalculatorCompleteService;

  beforeEach(() => {
    service = new BenefitCalculatorCompleteService();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct endpoint', () => {
      expect(service['baseUrl']).toBe(API_ENDPOINTS.COMPLETE_BENEFIT_CALCULATOR);
    });
  });

  describe('submitCalculation', () => {
    const mockFormData: FormSubmissionData = {
      processInstanceId: 'process-123',
      variables: {
        field1: { value: 'value1', type: 'String' },
        field2: { value: 123.45, type: 'Double' },
      },
    };

    it('should submit calculation successfully and return result', async () => {
      const mockResponse: BenefitCalculationResult = {
        success: true,
        data: { calculationResult: 1000 },
        calculationId: 'calc-123',
        timestamp: '2023-01-01T00:00:00Z',
      };

      mockMakeRequest.mockResolvedValueOnce(mockResponse);

      const result = await service.submitCalculation(mockFormData);

      expect(mockMakeRequest).toHaveBeenCalledWith(
        API_ENDPOINTS.COMPLETE_BENEFIT_CALCULATOR,
        {
          method: 'POST',
          body: JSON.stringify(mockFormData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API error responses', async () => {
      const errorResponse: ApiError = {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: { field: 'processInstanceId' },
      };

      mockMakeRequest.mockResolvedValueOnce(errorResponse);

      await expect(service.submitCalculation(mockFormData)).rejects.toThrow(
        'Validation failed'
      );

      expect(mockMakeRequest).toHaveBeenCalledWith(
        API_ENDPOINTS.COMPLETE_BENEFIT_CALCULATOR,
        {
          method: 'POST',
          body: JSON.stringify(mockFormData),
        }
      );
    });

    it('should handle API error without message', async () => {
      const errorResponse: ApiError = {
        error: '',
      };

      mockMakeRequest.mockResolvedValueOnce(errorResponse);

      await expect(service.submitCalculation(mockFormData)).rejects.toThrow(
        'Unknown API error'
      );
    });

    it('should handle unknown response format by creating default success response', async () => {
      const unknownResponse = {
        someField: 'someValue',
        data: { result: 'test' },
      };

      mockMakeRequest.mockResolvedValueOnce(unknownResponse);

      const result = await service.submitCalculation(mockFormData);

      expect(result).toEqual({
        success: true,
        data: unknownResponse,
      });
    });

    it('should preserve success response if it matches BenefitCalculationResult', async () => {
      const successResponse: BenefitCalculationResult = {
        success: true,
        data: { amount: 2500 },
        message: 'Calculation completed successfully',
      };

      mockMakeRequest.mockResolvedValueOnce(successResponse);

      const result = await service.submitCalculation(mockFormData);

      expect(result).toEqual(successResponse);
    });

    it('should handle empty form data', async () => {
      const emptyFormData: FormSubmissionData = {
        processInstanceId: '',
        variables: {},
      };

      const mockResponse: BenefitCalculationResult = {
        success: true,
        data: {},
      };

      mockMakeRequest.mockResolvedValueOnce(mockResponse);

      const result = await service.submitCalculation(emptyFormData);

      expect(mockMakeRequest).toHaveBeenCalledWith(
        API_ENDPOINTS.COMPLETE_BENEFIT_CALCULATOR,
        {
          method: 'POST',
          body: JSON.stringify(emptyFormData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle complex form data with multiple variable types', async () => {
      const complexFormData: FormSubmissionData = {
        processInstanceId: 'complex-process-456',
        variables: {
          stringVar: { value: 'test string', type: 'String' },
          doubleVar: { value: 999.99, type: 'Double' },
          booleanVar: { value: true, type: 'Boolean' },
          nullVar: { value: null, type: 'String' },
        },
      };

      const mockResponse: BenefitCalculationResult = {
        success: true,
        data: {
          calculatedAmount: 5000,
          factors: ['age', 'salary', 'years'],
        },
        calculationId: 'complex-calc-789',
      };

      mockMakeRequest.mockResolvedValueOnce(mockResponse);

      const result = await service.submitCalculation(complexFormData);

      expect(mockMakeRequest).toHaveBeenCalledWith(
        API_ENDPOINTS.COMPLETE_BENEFIT_CALCULATOR,
        {
          method: 'POST',
          body: JSON.stringify(complexFormData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should propagate network errors from base service', async () => {
      const networkError = new Error('Network connection failed');
      mockMakeRequest.mockRejectedValueOnce(networkError);

      await expect(service.submitCalculation(mockFormData)).rejects.toThrow(
        'Network connection failed'
      );
    });

    it('should propagate timeout errors from base service', async () => {
      const timeoutError = new Error('Request timeout');
      mockMakeRequest.mockRejectedValueOnce(timeoutError);

      await expect(service.submitCalculation(mockFormData)).rejects.toThrow(
        'Request timeout'
      );
    });
  });
});
