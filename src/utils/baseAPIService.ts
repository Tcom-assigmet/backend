import { ApiError, BenefitCalculationResult } from "../types/api";
import { AlertManager, getApiErrorMessage, getNetworkErrorMessage } from "./alertUtils";

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
  protected showAlerts: boolean;

  constructor(endpoint: string, showAlerts: boolean = true) {
    this.baseUrl = endpoint;
    this.showAlerts = showAlerts;
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
        const errorMessage = this.getErrorMessage(response.status, responseData);
        
        // Show alert if enabled
        if (this.showAlerts) {
          AlertManager.showError(errorMessage, 'API Request Failed');
        }
        
        throw new Error(errorMessage);
      }

      return responseData;
    } catch (error) {
      if (error instanceof Error) {
        // If this is already our custom error, don't show alert again
        if (error.message.includes('API Request Failed')) {
          throw error;
        }
        
        // Show alert for other errors if enabled
        if (this.showAlerts) {
          AlertManager.showError(error.message, 'Request Error');
        }
        
        throw error;
      }
      
      const networkError = getNetworkErrorMessage();
      
      // Show alert for network errors if enabled
      if (this.showAlerts) {
        AlertManager.showError(networkError, 'Network Error');
      }
      
      throw new Error(networkError);
    }
  }

  private getErrorMessage(status: number, responseData: unknown): string {
    // Extract message from response data if available
    const responseMessage =
      typeof responseData === 'object' &&
      responseData !== null &&
      'message' in responseData &&
      typeof (responseData as { message?: unknown }).message === 'string'
        ? (responseData as { message: string }).message
        : undefined;

    // Use response message if available, otherwise use standard API error message
    return responseMessage || getApiErrorMessage(status);
  }
}