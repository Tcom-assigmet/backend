import type { ProcessStatus } from '@/constants';
import type { 
  DataType, 
  FormValue, 
  FormErrors, 
  ProcessedFormData,
  BaseApiResponse
} from './common';

// Benefit Calculator Domain Types
export interface BenefitClass {
  readonly id: string;
  readonly value: string;
}

export interface PlanNumber {
  readonly id: string;
  readonly value: string;
  readonly description?: string;
}

export interface BenefitClassRule {
  readonly id: string;
  readonly minAge: number;
  readonly maxAge: number;
}

export interface PaymentType {
  readonly id: string;
  readonly value: string;
  readonly benefitClasses: readonly BenefitClassRule[];
}

// Form Data Types
export interface BenefitCalculatorFormData {
  firstName: string;
  lastName: string;
  memberId: string;
  dateOfBirth: Date | null;
  dateJoinedFund: Date | null;
  effectiveDate: Date | null;
  calculationDate: Date | null;
  benefitClass: string;
  paymentType: string;
  planNumber: string;
}

export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  memberId?: string;
  dateOfBirth?: string;
  dateJoinedFund?: string;
  effectiveDate?: string;
  calculationDate?: string;
  benefitClass?: string;
  paymentType?: string;
  planNumber?: string;
  ageValidation?: string;
  dateLogic?: string;
  submit?: string;
}

// Field Configuration Types
export interface RequiredField {
  readonly id: string;
  readonly label: string;
  readonly dataType: DataType;
  readonly required: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly pattern?: string;
}

// Component Props Types
export interface BenefitCalculationDetailFormFieldProps {
  field: RequiredField;
  value: FormValue;
  error?: string;
  touched?: boolean;
  onChange: (id: string, value: FormValue) => void;
  onBlur?: (id: string) => void;
}

export interface BenefitCalculatorFormProps {
  onClose?: () => void;
}

// Member and Calculation Data Types
export interface MemberData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  dateJoinedFund?: string;
  memberId?: string;
  effectiveDate?: string;
  calculationDate?: string;
  benefitClass?: string;
  paymentType?: string;
  paymentTypeDesc?: string;
  [key: string]: string | number | undefined;
}

export interface SubProcessData {
  pymntAmt?: string;
  minBenCheck?: string;
  maxBenCheck?: string;
  totalVolAcctsAdd?: string;
  totalVolAcctsSub?: string;
  totalVolAcctsNet?: string;
  [key: string]: string | number | undefined;
}

export interface BenefitCalFinalResult {
  readonly success: boolean;
  readonly memberData?: MemberData;
  readonly subProcessData?: SubProcessData;
  readonly errors?: readonly string[];
  readonly timestamp?: string;
}

export interface CalculationFactor {
  readonly key: string;
  readonly label: string;
  readonly value: string | number | undefined;
}

// Batch Processing Types
export interface BatchStatus {
  readonly batchId: string;
  readonly status: ProcessStatus;
  readonly totalRecords: number;
  readonly processedRecords: number;
  readonly successfulRecords: number;
  readonly failedRecords: number;
  readonly startTime: string;
  readonly endTime?: string;
}

export interface CalculationResult {
  readonly memberData: MemberData;
  readonly subProcessData?: SubProcessData;
}

export interface ProcessingResult {
  readonly batchId: string;
  readonly processInstanceId: string;
  readonly taskId: string;
  readonly memberData: MemberData;
  readonly result?: CalculationResult;
  readonly error?: string;
}

// Store State Types
export interface StoreState {
  benefitcalFinalResult?: BenefitCalFinalResult;
  benefitCalRequiredFilelds?: readonly RequiredField[];
}

// API Response Types
export interface ApiResponse<T = unknown> extends BaseApiResponse<T> {}

export interface BenefitCalculatorApiResponse extends ApiResponse<BenefitCalFinalResult> {}

export interface BatchProcessApiResponse extends ApiResponse<BatchStatus> {}

// Utility Types
export type FormDataKeys = keyof BenefitCalculatorFormData;
export type ValidationErrorKeys = keyof ValidationErrors;
export type MemberDataKeys = keyof MemberData;

// Type Guards
export const isValidDataType = (value: string): value is DataType => {
  return ['Double', 'String', 'Boolean', 'Date'].includes(value);
};

export const isValidProcessStatus = (value: string): value is ProcessStatus => {
  return ['pending', 'processing', 'completed', 'failed', 'cancelled'].includes(value);
};

export const isMemberData = (obj: unknown): obj is MemberData => {
  return typeof obj === 'object' && obj !== null;
};

export const isBenefitCalFinalResult = (obj: unknown): obj is BenefitCalFinalResult => {
  return typeof obj === 'object' && obj !== null && 'success' in obj;
};
