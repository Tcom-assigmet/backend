import { BenefitCalculatorStartService } from '@/src/components/forms/benefitCalculatorStartForm/services/benefit-calculator-service';
import { API_ENDPOINTS } from '@/src/configs/api';
import { BenefitCalculatorRequest, BenefitCalculatorResponse } from '@/src/types/api';

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
}));

// Mock fetch globally
const mockMakeRequest = jest.fn();
(global as any).mockMakeRequest = mockMakeRequest;

describe('BenefitCalculatorStartService', () => {
  let service: BenefitCalculatorStartService;

  beforeEach(() => {
    service = new BenefitCalculatorStartService();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct endpoint', () => {
      expect(service['baseUrl']).toBe(API_ENDPOINTS.START_BENEFIT_CALCULATOR);
    });
  });

  describe('startProcess', () => {
    const mockRequestData: BenefitCalculatorRequest = {
      firstName: 'John',
      lastName: 'Doe',
      memberId: 'MEM123456',
      dateOfBirth: '1990-01-01',
      dateJoinedFund: '2010-06-15',
      effectiveDate: '2023-01-01',
      calculationDate: '2023-12-31',
      benefitClass: 'A',
      paymentType: 'monthly',
      planNumber: '001',
      paymentTypeDesc: 'Monthly Payment',
    };

    it('should start process successfully and return response with success flag', async () => {
      const mockApiResponse: Omit<BenefitCalculatorResponse, 'success'> = {
        processInstanceId: 'process-123',
        requiredFields: [
          { id: 'salary', label: 'Annual Salary', dataType: 'Double' },
          { id: 'department', label: 'Department', dataType: 'String' },
        ],
        message: 'Process started successfully',
      };

      mockMakeRequest.mockResolvedValueOnce(mockApiResponse);

      const result = await service.startProcess(mockRequestData);

      expect(mockMakeRequest).toHaveBeenCalledWith(
        API_ENDPOINTS.START_BENEFIT_CALCULATOR,
        {
          method: 'POST',
          body: JSON.stringify(mockRequestData),
        }
      );

      expect(result).toEqual({
        ...mockApiResponse,
        success: true,
      });
    });

    it('should handle response without required fields', async () => {
      const mockApiResponse: Omit<BenefitCalculatorResponse, 'success'> = {
        processInstanceId: 'process-456',
        message: 'Process started, no additional fields required',
      };

      mockMakeRequest.mockResolvedValueOnce(mockApiResponse);

      const result = await service.startProcess(mockRequestData);

      expect(result).toEqual({
        ...mockApiResponse,
        success: true,
      });
    });

    it('should handle minimal request data', async () => {
      const minimalRequestData: BenefitCalculatorRequest = {
        firstName: 'Jane',
        lastName: 'Smith',
        memberId: 'MEM789',
        benefitClass: 'B',
        paymentType: 'annual',
        planNumber: '002',
        paymentTypeDesc: 'Annual Payment',
      };

      const mockApiResponse: Omit<BenefitCalculatorResponse, 'success'> = {
        processInstanceId: 'process-789',
        requiredFields: [
          { id: 'experience', label: 'Years of Experience', dataType: 'Double' },
        ],
      };

      mockMakeRequest.mockResolvedValueOnce(mockApiResponse);

      const result = await service.startProcess(minimalRequestData);

      expect(mockMakeRequest).toHaveBeenCalledWith(
        API_ENDPOINTS.START_BENEFIT_CALCULATOR,
        {
          method: 'POST',
          body: JSON.stringify(minimalRequestData),
        }
      );

      expect(result).toEqual({
        ...mockApiResponse,
        success: true,
      });
    });

    it('should handle response with multiple required fields of different types', async () => {
      const mockApiResponse: Omit<BenefitCalculatorResponse, 'success'> = {
        processInstanceId: 'process-complex',
        requiredFields: [
          { id: 'salary', label: 'Annual Salary', dataType: 'Double' },
          { id: 'department', label: 'Department', dataType: 'String' },
          { id: 'isManager', label: 'Is Manager', dataType: 'Boolean' },
          { id: 'startDate', label: 'Start Date', dataType: 'String' },
        ],
        message: 'Process initiated, additional information required',
      };

      mockMakeRequest.mockResolvedValueOnce(mockApiResponse);

      const result = await service.startProcess(mockRequestData);

      expect(result).toEqual({
        ...mockApiResponse,
        success: true,
      });

      expect(result.requiredFields).toHaveLength(4);
      expect(result.requiredFields![0].dataType).toBe('Double');
      expect(result.requiredFields![1].dataType).toBe('String');
      expect(result.requiredFields![2].dataType).toBe('Boolean');
      expect(result.requiredFields![3].dataType).toBe('String');
    });

    it('should handle empty required fields array', async () => {
      const mockApiResponse: Omit<BenefitCalculatorResponse, 'success'> = {
        processInstanceId: 'process-empty',
        requiredFields: [],
        message: 'Process completed, no additional fields needed',
      };

      mockMakeRequest.mockResolvedValueOnce(mockApiResponse);

      const result = await service.startProcess(mockRequestData);

      expect(result).toEqual({
        ...mockApiResponse,
        success: true,
      });
      expect(result.requiredFields).toEqual([]);
    });

    it('should propagate network errors from base service', async () => {
      const networkError = new Error('Network connection failed');
      mockMakeRequest.mockRejectedValueOnce(networkError);

      await expect(service.startProcess(mockRequestData)).rejects.toThrow(
        'Network connection failed'
      );
    });

    it('should propagate validation errors from API', async () => {
      const validationError = new Error('Invalid member ID format');
      mockMakeRequest.mockRejectedValueOnce(validationError);

      await expect(service.startProcess(mockRequestData)).rejects.toThrow(
        'Invalid member ID format'
      );
    });

    it('should handle request with all optional fields populated', async () => {
      const fullRequestData: BenefitCalculatorRequest = {
        firstName: 'Alice',
        lastName: 'Johnson',
        memberId: 'MEM999888',
        dateOfBirth: '1985-03-15',
        dateJoinedFund: '2008-09-01',
        effectiveDate: '2023-06-01',
        calculationDate: '2023-11-30',
        benefitClass: 'Premium',
        paymentType: 'quarterly',
        planNumber: '003',
        paymentTypeDesc: 'Quarterly Payment Plan',
      };

      const mockApiResponse: Omit<BenefitCalculatorResponse, 'success'> = {
        processInstanceId: 'process-full-data',
        requiredFields: [
          { id: 'bonus', label: 'Annual Bonus', dataType: 'Double' },
        ],
        message: 'Full profile processed successfully',
      };

      mockMakeRequest.mockResolvedValueOnce(mockApiResponse);

      const result = await service.startProcess(fullRequestData);

      expect(mockMakeRequest).toHaveBeenCalledWith(
        API_ENDPOINTS.START_BENEFIT_CALCULATOR,
        {
          method: 'POST',
          body: JSON.stringify(fullRequestData),
        }
      );

      expect(result).toEqual({
        ...mockApiResponse,
        success: true,
      });
    });

    it('should handle response without message', async () => {
      const mockApiResponse: Omit<BenefitCalculatorResponse, 'success' | 'message'> = {
        processInstanceId: 'process-no-message',
        requiredFields: [
          { id: 'position', label: 'Job Position', dataType: 'String' },
        ],
      };

      mockMakeRequest.mockResolvedValueOnce(mockApiResponse);

      const result = await service.startProcess(mockRequestData);

      expect(result).toEqual({
        ...mockApiResponse,
        success: true,
      });
      expect(result.message).toBeUndefined();
    });

    it('should always add success: true to response', async () => {
      const mockApiResponse = {
        processInstanceId: 'test-process',
        someOtherField: 'value',
      };

      mockMakeRequest.mockResolvedValueOnce(mockApiResponse);

      const result = await service.startProcess(mockRequestData);

      expect(result.success).toBe(true);
      expect(result).toEqual({
        ...mockApiResponse,
        success: true,
      });
    });
  });
});
