// api.ts

import { FormValue, ApiError, BaseApiResponse } from "./common";

export interface BenefitCalculatorRequest {
  firstName: string;
  lastName: string;
  memberId: string;
  dateOfBirth?: string;
  dateJoinedFund?: string;
  effectiveDate?: string;
  calculationDate?: string;
  benefitClass: string;
  paymentType: string;
  planNumber: string;
  paymentTypeDesc: string;
}

export interface BenefitCalculatorResponse {
  processInstanceId: string;
  requiredFields?: Array<{
    id: string;
    label: string;
    dataType: 'String' | 'Double' | 'Boolean';
  }>;
  success: boolean;
  message?: string;
}

export type ApiResponse<T = BenefitCalculationResult> = T | ApiError;

export interface BenefitCalculationResult extends BaseApiResponse<Record<string, unknown>> {
  calculationId?: string;
}

export interface FormSubmissionData {
  processInstanceId: string;
  variables: Record<string, { value: FormValue; type: string }>;
}
