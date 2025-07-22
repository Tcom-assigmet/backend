import { ApiError, BenefitCalculationResult } from "../types/api";

export const isApiError = (response: unknown): response is ApiError => {
  return typeof response === 'object' && 
         response !== null && 
         'error' in response;
};

export const isBenefitCalculationResult = (response: unknown): response is BenefitCalculationResult => {
  return typeof response === 'object' && 
         response !== null && 
         'success' in response;
};

// Base service class for common functionality
export abstract class BaseApiService {
  protected readonly baseUrl: string;

  constructor(endpoint: string) {
    this.baseUrl = endpoint;
  }

  protected async makeRequest<T>(
    url: string,
    options: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(this.getErrorMessage(response.status, responseData));
      }

      return responseData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  private getErrorMessage(status: number, responseData: unknown): string {
    const defaultMessages: Record<number, string> = {
      400: 'Invalid request data',
      401: 'Unauthorized access',
      403: 'Access forbidden',
      404: 'Service not found',
      500: 'Internal server error. Please try again later.',
    };

    const message =
      typeof responseData === 'object' &&
      responseData !== null &&
      'message' in responseData &&
      typeof (responseData as { message?: unknown }).message === 'string'
        ? (responseData as { message: string }).message
        : undefined;

    return message ||
           defaultMessages[status] ||
           `Unexpected error: ${status}`;
  }
}