import { API_ENDPOINTS } from "@/config/api";
import { ApiResponse, BenefitCalculationResult, FormSubmissionData } from "@/types/api";
import { BaseApiService, isApiError, isBenefitCalculationResult } from "@/services/baseAPIService";

export class BenefitCalculatorCompleteService extends BaseApiService {
  constructor() {
    super(API_ENDPOINTS.COMPLETE_BENEFIT_CALCULATOR);
  }

  async submitCalculation(data: FormSubmissionData): Promise<BenefitCalculationResult> {
    const response = await this.makeRequest<ApiResponse>(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (isApiError(response)) {
      throw new Error(response.error || 'Unknown API error');
    }

    if (isBenefitCalculationResult(response)) {
      return response;
    }

    return {
      success: true,
      data: response as Record<string, unknown>,
    };
  }
}