// api.ts

import { FormValue } from "./benefitcalculator";

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

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export type ApiResponse<T = BenefitCalculationResult> = T | ApiError;

export interface BenefitCalculationResult {
  success: boolean;
  data?: Record<string, unknown>;
  message?: string;
  calculationId?: string;
  timestamp?: string;
}

export interface FormSubmissionData {
  processInstanceId: string;
  variables: Record<string, { value: FormValue; type: string }>;
}
