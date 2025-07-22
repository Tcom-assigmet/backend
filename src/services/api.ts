import type {
  ApiResponse,
  BenefitCalculatorApiResponse,
  BenefitCalculatorFormData,
  BatchProcessApiResponse,
  BatchStatus,
  ProcessingResult,
  MemberData,
} from '@/types/benefitcalculator';
import { API_ENDPOINTS } from '@/constants';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// Custom Error Classes
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response?: Response,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public readonly originalError: Error) {
    super(message);
    this.name = 'NetworkError';
  }
}

// HTTP Client with proper error handling
class HttpClient {
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: typeof API_CONFIG) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = config.headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response,
        );
      }

      const data = await response.json() as ApiResponse<T>;
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError) {
        throw new NetworkError('Network connection failed', error);
      }
      
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Initialize HTTP client
const httpClient = new HttpClient(API_CONFIG);

// Benefit Calculator API Service
export const benefitCalculatorApi = {
  /**
   * Calculate benefits for a single member
   */
  async calculate(formData: BenefitCalculatorFormData): Promise<BenefitCalculatorApiResponse> {
    const response = await httpClient.post<BenefitCalculatorApiResponse['data']>(
      API_ENDPOINTS.BENEFIT_CALCULATOR,
      formData,
    );
    return response as BenefitCalculatorApiResponse;
  },

  /**
   * Get required fields for benefit calculation
   */
  async getRequiredFields(): Promise<ApiResponse<Array<{ id: string; label: string; dataType: string }>>> {
    return httpClient.get(`${API_ENDPOINTS.BENEFIT_CALCULATOR}/fields`);
  },

  /**
   * Validate member data
   */
  async validateMember(memberData: Partial<MemberData>): Promise<ApiResponse<{ valid: boolean; errors?: string[] }>> {
    return httpClient.post(`${API_ENDPOINTS.BENEFIT_CALCULATOR}/validate`, memberData);
  },
} as const;

// Bulk Processing API Service
export const bulkProcessApi = {
  /**
   * Start bulk processing
   */
  async startBulkProcess(file: File): Promise<BatchProcessApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.BULK_PROCESS}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response,
      );
    }

    return response.json() as Promise<BatchProcessApiResponse>;
  },

  /**
   * Get batch status
   */
  async getBatchStatus(batchId: string): Promise<ApiResponse<BatchStatus>> {
    return httpClient.get(`${API_ENDPOINTS.BULK_PROCESS}/${batchId}/status`);
  },

  /**
   * Get batch results
   */
  async getBatchResults(batchId: string): Promise<ApiResponse<ProcessingResult[]>> {
    return httpClient.get(`${API_ENDPOINTS.BULK_PROCESS}/${batchId}/results`);
  },

  /**
   * Cancel batch processing
   */
  async cancelBatch(batchId: string): Promise<ApiResponse<{ cancelled: boolean }>> {
    return httpClient.delete(`${API_ENDPOINTS.BULK_PROCESS}/${batchId}`);
  },

  /**
   * Download batch results as CSV
   */
  async downloadResults(batchId: string): Promise<Blob> {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.BULK_PROCESS}/${batchId}/download`,
      {
        headers: API_CONFIG.headers,
      },
    );

    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response,
      );
    }

    return response.blob();
  },
} as const;

// Member Data API Service
export const memberDataApi = {
  /**
   * Get member by ID
   */
  async getMember(memberId: string): Promise<ApiResponse<MemberData>> {
    return httpClient.get(`${API_ENDPOINTS.MEMBER_DATA}/${memberId}`);
  },

  /**
   * Search members
   */
  async searchMembers(searchParams: {
    query?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ members: MemberData[]; total: number }>> {
    const queryString = new URLSearchParams(
      Object.entries(searchParams).filter(([, value]) => value !== undefined),
    ).toString();
    
    return httpClient.get(`${API_ENDPOINTS.MEMBER_DATA}?${queryString}`);
  },
} as const;

// Export combined API service
export const apiService = {
  benefitCalculator: benefitCalculatorApi,
  bulkProcess: bulkProcessApi,
  memberData: memberDataApi,
} as const;

export default apiService;