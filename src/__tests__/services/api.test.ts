import { apiService, ApiError, NetworkError } from '@/services/api';
import type { BenefitCalculatorFormData } from '@/types/benefitcalculator';

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('API Service', () => {
  const mockFormData: BenefitCalculatorFormData = {
    firstName: 'John',
    lastName: 'Doe',
    memberId: 'ABC123',
    dateOfBirth: new Date('1990-01-01'),
    dateJoinedFund: new Date('2020-01-01'),
    effectiveDate: new Date('2023-01-01'),
    calculationDate: new Date('2024-01-01'),
    benefitClass: 'Class A',
    paymentType: 'Monthly',
    planNumber: 'PLAN001',
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('Benefit Calculator API', () => {
    describe('calculate', () => {
      it('should successfully calculate benefits', async () => {
        const mockResponse = {
          success: true,
          data: {
            success: true,
            memberData: {
              firstName: 'John',
              lastName: 'Doe',
              memberId: 'ABC123',
            },
            subProcessData: {
              pymntAmt: '1000.00',
            },
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await apiService.benefitCalculator.calculate(mockFormData);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/benefit-calculator'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify(mockFormData),
          })
        );

        expect(result).toEqual(mockResponse);
      });

      it('should handle API errors', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
        } as Response);

        await expect(
          apiService.benefitCalculator.calculate(mockFormData)
        ).rejects.toThrow(ApiError);
      });

      it('should handle network errors', async () => {
        mockFetch.mockRejectedValueOnce(new TypeError('Network request failed'));

        await expect(
          apiService.benefitCalculator.calculate(mockFormData)
        ).rejects.toThrow(NetworkError);
      });
    });

    describe('getRequiredFields', () => {
      it('should fetch required fields successfully', async () => {
        const mockFields = {
          success: true,
          data: [
            { id: 'firstName', label: 'First Name', dataType: 'String' },
            { id: 'lastName', label: 'Last Name', dataType: 'String' },
          ],
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockFields,
        } as Response);

        const result = await apiService.benefitCalculator.getRequiredFields();

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/benefit-calculator/fields'),
          expect.objectContaining({
            method: 'GET',
          })
        );

        expect(result).toEqual(mockFields);
      });
    });

    describe('validateMember', () => {
      it('should validate member data successfully', async () => {
        const memberData = { memberId: 'ABC123', firstName: 'John' };
        const mockResponse = {
          success: true,
          data: { valid: true },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await apiService.benefitCalculator.validateMember(memberData);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/benefit-calculator/validate'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(memberData),
          })
        );

        expect(result).toEqual(mockResponse);
      });

      it('should return validation errors', async () => {
        const memberData = { memberId: 'INVALID' };
        const mockResponse = {
          success: false,
          data: { 
            valid: false, 
            errors: ['Invalid member ID format'] 
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await apiService.benefitCalculator.validateMember(memberData);

        expect(result.data?.valid).toBe(false);
        expect(result.data?.errors).toContain('Invalid member ID format');
      });
    });
  });

  describe('Bulk Process API', () => {
    describe('startBulkProcess', () => {
      it('should start bulk processing successfully', async () => {
        const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' });
        const mockResponse = {
          success: true,
          data: {
            batchId: 'batch-123',
            status: 'processing',
            totalRecords: 100,
            processedRecords: 0,
            successfulRecords: 0,
            failedRecords: 0,
            startTime: '2024-01-01T00:00:00Z',
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await apiService.bulkProcess.startBulkProcess(mockFile);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/bulk-process'),
          expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData),
          })
        );

        expect(result).toEqual(mockResponse);
      });

      it('should handle file upload errors', async () => {
        const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' });

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 413,
          statusText: 'Payload Too Large',
        } as Response);

        await expect(
          apiService.bulkProcess.startBulkProcess(mockFile)
        ).rejects.toThrow(ApiError);
      });
    });

    describe('getBatchStatus', () => {
      it('should get batch status successfully', async () => {
        const batchId = 'batch-123';
        const mockResponse = {
          success: true,
          data: {
            batchId,
            status: 'completed',
            totalRecords: 100,
            processedRecords: 100,
            successfulRecords: 95,
            failedRecords: 5,
            startTime: '2024-01-01T00:00:00Z',
            endTime: '2024-01-01T00:05:00Z',
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await apiService.bulkProcess.getBatchStatus(batchId);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(`/api/bulk-process/${batchId}/status`),
          expect.objectContaining({
            method: 'GET',
          })
        );

        expect(result).toEqual(mockResponse);
      });
    });

    describe('getBatchResults', () => {
      it('should get batch results successfully', async () => {
        const batchId = 'batch-123';
        const mockResponse = {
          success: true,
          data: [
            {
              batchId,
              processInstanceId: 'process-1',
              taskId: 'task-1',
              memberData: { firstName: 'John', lastName: 'Doe' },
              result: { memberData: { firstName: 'John' } },
            },
          ],
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await apiService.bulkProcess.getBatchResults(batchId);

        expect(result).toEqual(mockResponse);
      });
    });

    describe('cancelBatch', () => {
      it('should cancel batch successfully', async () => {
        const batchId = 'batch-123';
        const mockResponse = {
          success: true,
          data: { cancelled: true },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await apiService.bulkProcess.cancelBatch(batchId);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(`/api/bulk-process/${batchId}`),
          expect.objectContaining({
            method: 'DELETE',
          })
        );

        expect(result).toEqual(mockResponse);
      });
    });

    describe('downloadResults', () => {
      it('should download results as blob', async () => {
        const batchId = 'batch-123';
        const mockBlob = new Blob(['csv,content'], { type: 'text/csv' });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          blob: async () => mockBlob,
        } as Response);

        const result = await apiService.bulkProcess.downloadResults(batchId);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(`/api/bulk-process/${batchId}/download`),
          expect.objectContaining({
            headers: expect.any(Object),
          })
        );

        expect(result).toEqual(mockBlob);
      });

      it('should handle download errors', async () => {
        const batchId = 'batch-123';

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        } as Response);

        await expect(
          apiService.bulkProcess.downloadResults(batchId)
        ).rejects.toThrow(ApiError);
      });
    });
  });

  describe('Member Data API', () => {
    describe('getMember', () => {
      it('should get member by ID successfully', async () => {
        const memberId = 'ABC123';
        const mockResponse = {
          success: true,
          data: {
            firstName: 'John',
            lastName: 'Doe',
            memberId,
            dateOfBirth: '1990-01-01',
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await apiService.memberData.getMember(memberId);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(`/api/member-data/${memberId}`),
          expect.objectContaining({
            method: 'GET',
          })
        );

        expect(result).toEqual(mockResponse);
      });

      it('should handle member not found', async () => {
        const memberId = 'NOTFOUND';

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        } as Response);

        await expect(
          apiService.memberData.getMember(memberId)
        ).rejects.toThrow(ApiError);
      });
    });

    describe('searchMembers', () => {
      it('should search members successfully', async () => {
        const searchParams = { query: 'John', limit: 10, offset: 0 };
        const mockResponse = {
          success: true,
          data: {
            members: [
              { firstName: 'John', lastName: 'Doe', memberId: 'ABC123' },
              { firstName: 'John', lastName: 'Smith', memberId: 'ABC124' },
            ],
            total: 2,
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await apiService.memberData.searchMembers(searchParams);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/member-data?query=John&limit=10&offset=0'),
          expect.objectContaining({
            method: 'GET',
          })
        );

        expect(result).toEqual(mockResponse);
      });

      it('should handle empty search results', async () => {
        const searchParams = { query: 'NonExistent' };
        const mockResponse = {
          success: true,
          data: {
            members: [],
            total: 0,
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await apiService.memberData.searchMembers(searchParams);

        expect(result.data?.members).toHaveLength(0);
        expect(result.data?.total).toBe(0);
      });
    });
  });

  describe('Error Classes', () => {
    describe('ApiError', () => {
      it('should create ApiError with correct properties', () => {
        const mockResponse = {} as Response;
        const error = new ApiError('Test error', 400, mockResponse);

        expect(error.name).toBe('ApiError');
        expect(error.message).toBe('Test error');
        expect(error.status).toBe(400);
        expect(error.response).toBe(mockResponse);
        expect(error).toBeInstanceOf(Error);
      });
    });

    describe('NetworkError', () => {
      it('should create NetworkError with correct properties', () => {
        const originalError = new Error('Connection failed');
        const error = new NetworkError('Network error', originalError);

        expect(error.name).toBe('NetworkError');
        expect(error.message).toBe('Network error');
        expect(error.originalError).toBe(originalError);
        expect(error).toBeInstanceOf(Error);
      });
    });
  });
});