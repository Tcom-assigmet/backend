import { API_ENDPOINTS } from "@/config/api";
import { BenefitCalculatorRequest, BenefitCalculatorResponse } from "@/types/api";
import { BaseApiService } from "@/services/baseAPIService";

export class BenefitCalculatorStartService extends BaseApiService {
  constructor() {
    super(API_ENDPOINTS.START_BENEFIT_CALCULATOR);
  }

  async startProcess(data: BenefitCalculatorRequest): Promise<BenefitCalculatorResponse> {
    const response = await this.makeRequest<BenefitCalculatorResponse>(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return {
      ...response,
      success: true,
    };
  }
}