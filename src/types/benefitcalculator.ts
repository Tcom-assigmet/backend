// benefitcalculator.ts

export interface BenefitClass {
  id: string;
  value: string;
}

export interface PlanNumber {
  id: string;
  value: string;
  description?: string;
}

export interface BenefitClassRule {
  id: string;
  minAge: number;
  maxAge: number;
}

export interface PaymentType {
  id: string;
  value: string;
  benefitClasses: BenefitClassRule[];
}

export interface FormData {
  firstName: string;
  lastName: string;
  memberId: string;
  dateOfBirth: Date | undefined;
  dateJoinedFund: Date | undefined;
  effectiveDate: Date | undefined;
  calculationDate: Date | undefined;
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

export interface RequiredField {
  id: string;
  label: string;
  dataType: DataType;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}

export type DataType = 'Double' | 'String' | 'Boolean' | 'Date';
export type FormValue = string | number | boolean | null;
export type FormErrors = Record<string, string>;
export type ProcessedFormData = Record<string, FormValue>;

export interface BenefitCalculationDetailFormFieldProps {
  field: RequiredField;
  value: FormValue;
  error?: string;
  touched?: boolean;
  onChange: (id: string, value: FormValue) => void;
  onBlur?: (id: string) => void;
}

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
}

export interface BenefitCalFinalResult {
  success: boolean;
  memberData?: MemberData;
  subProcessData?: SubProcessData;
}

export interface CalculationFactor {
  key: string;
  label: string;
  value: string | number | undefined;
}

export interface StoreState {
  benefitcalFinalResult?: BenefitCalFinalResult;
  benefitCalRequiredFilelds?: RequiredField[];
}

export interface BenefitCalculatorFormProps {
  onClose?: () => void;
}

export interface BenefitCalculatorFormData {
  firstName: string;
  lastName: string;
  memberId: string;
  dateOfBirth: Date | undefined;
  dateJoinedFund: Date | undefined;
  effectiveDate: Date | undefined;
  calculationDate: Date | undefined;
  benefitClass: string;
  paymentType: string;
  planNumber: string;
}
