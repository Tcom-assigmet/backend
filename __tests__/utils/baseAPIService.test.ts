import { BaseApiService, isApiError, isBenefitCalculationResult } from '@/src/utils/baseAPIService';
import { AlertManager } from '@/src/utils/alertUtils';
import { ApiError, BenefitCalculationResult } from '@/src/types/api';

// Mock the AlertManager
jest.mock('@/src/utils/alertUtils', () => ({
  AlertManager: {
    showError: jest.fn(),
  },
  getApiErrorMessage: jest.fn((status: number) => `API Error ${status}`),
  getNetworkErrorMessage: jest.fn(() => 'Network Error'),
}));

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('baseAPIService', () => {
  describe('isApiError', () => {
    it('should return true for valid ApiError objects', () => {
      const apiError: ApiError = { error: 'Test error' };
      expect(isApiError(apiError)).toBe(true);
    });

    it('should return true for ApiError with additional properties', () => {
      const apiError: ApiError = {
        error: 'Test error',
        code: 'ERR001',
        details: { field: 'name' },
      };
      expect(isApiError(apiError)).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isApiError(null)).toBe(false);
      expect(isApiError(undefined)).toBe(false);
      expect(isApiError('string')).toBe(false);
      expect(isApiError(123)).toBe(false);
      expect(isApiError(true)).toBe(false);
    });

    it('should return false for objects without error property', () => {
      expect(isApiError({})).toBe(false);
      expect(isApiError({ message: 'test' })).toBe(false);
      expect(isApiError({ success: true })).toBe(false);
    });
  });

  describe('isBenefitCalculationResult', () => {
    it('should return true for valid BenefitCalculationResult objects', () => {
      const result: BenefitCalculationResult = { success: true };
      expect(isBenefitCalculationResult(result)).toBe(true);
    });

    it('should return true for BenefitCalculationResult with additional properties', () => {
      const result: BenefitCalculationResult = {
        success: true,
        data: { amount: 1000 },
        message: 'Calculation complete',
        calculationId: 'calc-123',
        timestamp: '2023-01-01T00:00:00Z',
      };
      expect(isBenefitCalculationResult(result)).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isBenefitCalculationResult(null)).toBe(false);
      expect(isBenefitCalculationResult(undefined)).toBe(false);
      expect(isBenefitCalculationResult('string')).toBe(false);
      expect(isBenefitCalculationResult(123)).toBe(false);
      expect(isBenefitCalculationResult(true)).toBe(false);
    });

    it('should return false for objects without success property', () => {
      expect(isBenefitCalculationResult({})).toBe(false);
      expect(isBenefitCalculationResult({ error: 'test' })).toBe(false);
      expect(isBenefitCalculationResult({ data: {} })).toBe(false);
    });
  });

  describe('BaseApiService', () => {
    class TestApiService extends BaseApiService {
      constructor(showAlerts = true) {
        super('https://api.test.com', showAlerts);
      }

      async testRequest<T>(url: string, options: RequestInit): Promise<T> {
        return this.makeRequest<T>(url, options);
      }
    }

    let service: TestApiService;
    let mockAlertManager: jest.Mocked<typeof AlertManager>;

    beforeEach(() => {
      service = new TestApiService();
      mockAlertManager = AlertManager as jest.Mocked<typeof AlertManager>;
      jest.clearAllMocks();
    });

    describe('constructor', () => {
      it('should set baseUrl and showAlerts properties', () => {
        const service1 = new TestApiService(true);
        expect(service1['baseUrl']).toBe('https://api.test.com');
        expect(service1['showAlerts']).toBe(true);

        const service2 = new TestApiService(false);
        expect(service2['showAlerts']).toBe(false);
      });

      it('should default showAlerts to true', () => {
        class DefaultService extends BaseApiService {
          constructor() {
            super('https://api.test.com');
          }
        }
        const service = new DefaultService();
        expect(service['showAlerts']).toBe(true);
      });
    });

    describe('makeRequest', () => {
      it('should make successful request and return data', async () => {
        const mockResponse = { success: true, data: 'test data' };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response);

        const result = await service.testRequest('https://api.test.com/test', {
          method: 'GET',
        });

        expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/test', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });
        expect(result).toEqual(mockResponse);
        expect(mockAlertManager.showError).not.toHaveBeenCalled();
      });

      it('should handle HTTP error responses', async () => {
        const errorResponse = { message: 'Bad request' };
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: () => Promise.resolve(errorResponse),
        } as Response);

        await expect(
          service.testRequest('https://api.test.com/test', { method: 'GET' })
        ).rejects.toThrow('Bad request');

        expect(mockAlertManager.showError).toHaveBeenCalledWith(
          'Bad request',
          'API Request Failed'
        );
      });

      it('should use API error message when response has no message', async () => {
        const errorResponse = {};
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: () => Promise.resolve(errorResponse),
        } as Response);

        await expect(
          service.testRequest('https://api.test.com/test', { method: 'GET' })
        ).rejects.toThrow('API Error 404');

        expect(mockAlertManager.showError).toHaveBeenCalledWith(
          'API Error 404',
          'API Request Failed'
        );
      });

      it('should not show alerts when showAlerts is false', async () => {
        const serviceNoAlerts = new TestApiService(false);
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ message: 'Bad request' }),
        } as Response);

        await expect(
          serviceNoAlerts.testRequest('https://api.test.com/test', { method: 'GET' })
        ).rejects.toThrow('Bad request');

        expect(mockAlertManager.showError).not.toHaveBeenCalled();
      });

      it('should handle network errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network failure'));

        await expect(
          service.testRequest('https://api.test.com/test', { method: 'GET' })
        ).rejects.toThrow('Network failure');

        expect(mockAlertManager.showError).toHaveBeenCalledWith(
          'Network failure',
          'Request Error'
        );
      });

      it('should handle unknown errors', async () => {
        mockFetch.mockRejectedValueOnce('Unknown error');

        await expect(
          service.testRequest('https://api.test.com/test', { method: 'GET' })
        ).rejects.toThrow('Network Error');

        expect(mockAlertManager.showError).toHaveBeenCalledWith(
          'Network Error',
          'Network Error'
        );
      });

      it('should not show duplicate alerts for already handled errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('API Request Failed: Duplicate'));

        await expect(
          service.testRequest('https://api.test.com/test', { method: 'GET' })
        ).rejects.toThrow('API Request Failed: Duplicate');

        expect(mockAlertManager.showError).not.toHaveBeenCalled();
      });

      it('should merge custom headers with default headers', async () => {
        const mockResponse = { success: true };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response);

        await service.testRequest('https://api.test.com/test', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer token',
            'Custom-Header': 'custom-value',
          },
        });

        expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/test', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer token',
            'Custom-Header': 'custom-value',
          },
        });
      });

      it('should handle POST requests with body', async () => {
        const mockResponse = { success: true };
        const requestBody = { name: 'test', value: 123 };
        
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response);

        await service.testRequest('https://api.test.com/test', {
          method: 'POST',
          body: JSON.stringify(requestBody),
        });

        expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/test', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      });
    });
  });
});
