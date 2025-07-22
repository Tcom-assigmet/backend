
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type {
  BenefitCalculatorFormData,
  FormValue,
  RequiredField,
  BenefitCalFinalResult,
  ProcessStatus,
} from '@/types/benefitcalculator';

// Store State Interface
interface BenefitCalculatorState {
  // Form Data
  formData: BenefitCalculatorFormData;
  formValues: Record<string, FormValue> | null;
  
  // Task Management
  taskInitiated: boolean;
  processInstanceId: string | null;
  calculationCount: number;
  
  // Results
  isResultModalOpen: boolean;
  requiredFields: readonly RequiredField[];
  finalResult: BenefitCalFinalResult | null;
  
  // Bulk Processing
  bulkProcess: {
    batchId: string | null;
    status: ProcessStatus | null;
  };
  
  // Loading States
  loading: {
    calculation: boolean;
    bulkProcess: boolean;
    fieldsFetch: boolean;
  };
  
  // Error States
  errors: {
    calculation: string | null;
    bulkProcess: string | null;
    validation: Record<string, string>;
  };
}

// Store Actions Interface
interface BenefitCalculatorActions {
  // Form Data Actions
  setFormData: (data: BenefitCalculatorFormData) => void;
  resetFormData: () => void;
  updateFormField: <K extends keyof BenefitCalculatorFormData>(
    field: K,
    value: BenefitCalculatorFormData[K],
  ) => void;
  
  // Form Values Actions
  setFormValues: (values: Record<string, FormValue>) => void;
  clearFormValues: () => void;
  updateFormValue: (key: string, value: FormValue) => void;
  
  // Task Management Actions
  setTaskInitiated: (initiated: boolean) => void;
  setProcessInstanceId: (id: string | null) => void;
  incrementCalculationCount: () => void;
  resetCalculationCount: () => void;
  
  // Results Actions
  setResultModalOpen: (open: boolean) => void;
  setRequiredFields: (fields: readonly RequiredField[]) => void;
  setFinalResult: (result: BenefitCalFinalResult | null) => void;
  
  // Bulk Processing Actions
  setBulkProcessBatchId: (batchId: string | null) => void;
  setBulkProcessStatus: (status: ProcessStatus | null) => void;
  resetBulkProcess: () => void;
  
  // Loading Actions
  setCalculationLoading: (loading: boolean) => void;
  setBulkProcessLoading: (loading: boolean) => void;
  setFieldsFetchLoading: (loading: boolean) => void;
  
  // Error Actions
  setCalculationError: (error: string | null) => void;
  setBulkProcessError: (error: string | null) => void;
  setValidationError: (field: string, error: string | null) => void;
  clearValidationErrors: () => void;
  clearAllErrors: () => void;
  
  // Reset Actions
  resetStore: () => void;
}

// Initial State
const initialFormData: BenefitCalculatorFormData = {
  firstName: '',
  lastName: '',
  memberId: '',
  dateOfBirth: null,
  dateJoinedFund: null,
  effectiveDate: null,
  calculationDate: null,
  benefitClass: '',
  paymentType: '',
  planNumber: '',
};

const initialState: BenefitCalculatorState = {
  // Form Data
  formData: initialFormData,
  formValues: null,
  
  // Task Management
  taskInitiated: false,
  processInstanceId: null,
  calculationCount: 0,
  
  // Results
  isResultModalOpen: false,
  requiredFields: [],
  finalResult: null,
  
  // Bulk Processing
  bulkProcess: {
    batchId: null,
    status: null,
  },
  
  // Loading States
  loading: {
    calculation: false,
    bulkProcess: false,
    fieldsFetch: false,
  },
  
  // Error States
  errors: {
    calculation: null,
    bulkProcess: null,
    validation: {},
  },
};

// Store Implementation
export const useBenefitCalculatorStore = create<BenefitCalculatorState & BenefitCalculatorActions>()(
  subscribeWithSelector(
    immer((set, get) => ({
      ...initialState,

      // Form Data Actions
      setFormData: (data) => set((state) => {
        state.formData = data;
      }),

      resetFormData: () => set((state) => {
        state.formData = initialFormData;
      }),

      updateFormField: (field, value) => set((state) => {
        state.formData[field] = value;
      }),

      // Form Values Actions
      setFormValues: (values) => set((state) => {
        state.formValues = values;
      }),

      clearFormValues: () => set((state) => {
        state.formValues = null;
      }),

      updateFormValue: (key, value) => set((state) => {
        if (!state.formValues) {
          state.formValues = {};
        }
        state.formValues[key] = value;
      }),

      // Task Management Actions
      setTaskInitiated: (initiated) => set((state) => {
        state.taskInitiated = initiated;
      }),

      setProcessInstanceId: (id) => set((state) => {
        state.processInstanceId = id;
      }),

      incrementCalculationCount: () => set((state) => {
        state.calculationCount += 1;
      }),

      resetCalculationCount: () => set((state) => {
        state.calculationCount = 0;
      }),

      // Results Actions
      setResultModalOpen: (open) => set((state) => {
        state.isResultModalOpen = open;
      }),

      setRequiredFields: (fields) => set((state) => {
        state.requiredFields = fields;
      }),

      setFinalResult: (result) => set((state) => {
        state.finalResult = result;
      }),

      // Bulk Processing Actions
      setBulkProcessBatchId: (batchId) => set((state) => {
        state.bulkProcess.batchId = batchId;
      }),

      setBulkProcessStatus: (status) => set((state) => {
        state.bulkProcess.status = status;
      }),

      resetBulkProcess: () => set((state) => {
        state.bulkProcess = {
          batchId: null,
          status: null,
        };
      }),

      // Loading Actions
      setCalculationLoading: (loading) => set((state) => {
        state.loading.calculation = loading;
      }),

      setBulkProcessLoading: (loading) => set((state) => {
        state.loading.bulkProcess = loading;
      }),

      setFieldsFetchLoading: (loading) => set((state) => {
        state.loading.fieldsFetch = loading;
      }),

      // Error Actions
      setCalculationError: (error) => set((state) => {
        state.errors.calculation = error;
      }),

      setBulkProcessError: (error) => set((state) => {
        state.errors.bulkProcess = error;
      }),

      setValidationError: (field, error) => set((state) => {
        if (error === null) {
          delete state.errors.validation[field];
        } else {
          state.errors.validation[field] = error;
        }
      }),

      clearValidationErrors: () => set((state) => {
        state.errors.validation = {};
      }),

      clearAllErrors: () => set((state) => {
        state.errors = {
          calculation: null,
          bulkProcess: null,
          validation: {},
        };
      }),

      // Reset Actions
      resetStore: () => set(() => ({ ...initialState })),
    })),
  ),
);

// Selector Hooks for Better Performance
export const useFormData = (): BenefitCalculatorFormData => 
  useBenefitCalculatorStore((state) => state.formData);

export const useFormValues = (): Record<string, FormValue> | null => 
  useBenefitCalculatorStore((state) => state.formValues);

export const useCalculationLoading = (): boolean => 
  useBenefitCalculatorStore((state) => state.loading.calculation);

export const useBulkProcessLoading = (): boolean => 
  useBenefitCalculatorStore((state) => state.loading.bulkProcess);

export const useCalculationError = (): string | null => 
  useBenefitCalculatorStore((state) => state.errors.calculation);

export const useValidationErrors = (): Record<string, string> => 
  useBenefitCalculatorStore((state) => state.errors.validation);

export const useFinalResult = (): BenefitCalFinalResult | null => 
  useBenefitCalculatorStore((state) => state.finalResult);

export const useBulkProcessState = (): { batchId: string | null; status: ProcessStatus | null } => 
  useBenefitCalculatorStore((state) => state.bulkProcess);

// Legacy export for backward compatibility
export const useStore = useBenefitCalculatorStore;