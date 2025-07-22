import { API_ENDPOINTS } from "@/src/configs/api";
import { BenefitCalculatorRequest, BenefitCalculatorResponse } from "@/src/types/api";
import { BaseApiService } from "@/src/utils/baseAPIService";

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