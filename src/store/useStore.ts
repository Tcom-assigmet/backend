
import { create } from 'zustand';
import { BenefitCalculatorFormData, FormValue } from '../types/benefitcalculator';


type Store = {
     benefitCalculatorFormData: BenefitCalculatorFormData;
    setBenefitCalculatorFormData: (data: BenefitCalculatorFormData) => void;
    resetBenefitCalculatorFormData: () => void;
    benefitCalculatorFormValues: Record<string, FormValue> | null;
    setBenefitCalculatorFormValues: (values: Record<string, FormValue>) => void;
    clearBenefitCalculatorFormValues: () => void;
    benefitCalculatorTaskInitiated: boolean;
    benefitCalculatorProcessInstanceId: string | null;
    countBenefitCalculations: number;
    openResultforBenefitCalculator: boolean;
    benefitCalRequiredFilelds: Array<{
        id: string;
       label: string;
       dataType: 'String' | 'Double' | 'Boolean';   
    }>;
    benefitcalFinalResult: object | null;
    bulkprocessBatchId: string | null;
    bulkprocessBatchStatus: string | null;

    setBenefitCalculatorProcessInstanceId: (benefitCalculatorProcessInstanceId: string | null) => void;
    setBenefitCalculatorTaskInitiated: (benefitCalculatorTaskInitiated: boolean) => void;
    setCountBenefitCalculations: (countBenefitCalculations: number) => void;
    setOpenResultforBenefitCalculator: (openResultforBenefitCalculator: boolean) => void;
     setBenefitCalRequiredFilelds: (benefitCalRequiredFilelds: Array<{
          id: string;
          label: string;
          dataType: 'String' | 'Double' | 'Boolean';
     }>) => void;
     setbenefitcalFinalResult: (benefitcalFinalResult: object | null) => void;
     setBulkprocessBatchId: (bulkprocessBatchId: string | null) => void;
     setBulkprocessBatchStatus: (bulkprocessBatchStatus: string | null) => void;
};

// type MyPersist = (
//     config: StateCreator<Store>,
//     options: PersistOptions<Store>
//   ) => StateCreator<Store>;
export const useStore = create<Store>((set) => ({
     benefitCalculatorFormValues: null,
     setBenefitCalculatorFormValues: (values: Record<string, FormValue>) => 
          set(() => ({benefitCalculatorFormValues: values})),
     clearBenefitCalculatorFormValues: () => 
          set(() => ({benefitCalculatorFormValues: null})),
     benefitCalculatorFormData: {
          firstName: '',
          lastName: '',
          memberId: '',
          dateOfBirth: undefined,
          dateJoinedFund: undefined,
          effectiveDate: undefined,
          calculationDate: undefined,
          benefitClass: '',
          paymentType: '',
          planNumber: ''
     },
     setBenefitCalculatorFormData: (data: BenefitCalculatorFormData) => 
           set(() => ({benefitCalculatorFormData: data})),
     resetBenefitCalculatorFormData: () => 
               set(() => ({
               benefitCalculatorFormData: {
                    firstName: '',
                    lastName: '',
                    memberId: '',
                    dateOfBirth: undefined,
                    dateJoinedFund: undefined,
                    effectiveDate: undefined,
                    calculationDate: undefined,
                    benefitClass: '',
                    paymentType: '',
                    planNumber: ''
               }
          })),
    benefitCalculatorTaskInitiated: false,
    benefitCalculatorProcessInstanceId: null,
    countBenefitCalculations: 0,
    openResultforBenefitCalculator: false,
     benefitCalRequiredFilelds: [],
     benefitcalFinalResult: null,
     bulkprocessBatchId: null,
     bulkprocessBatchStatus: null,
    setOpenResultforBenefitCalculator: (openResultforBenefitCalculator: boolean) => 
         set(() => ({openResultforBenefitCalculator})),
    setBenefitCalculatorTaskInitiated: (benefitCalculatorTaskInitiated: boolean) => 
         set(() => ({benefitCalculatorTaskInitiated})),
    setBenefitCalculatorProcessInstanceId: (benefitCalculatorProcessInstanceId: string | null) => 
         set(() => ({benefitCalculatorProcessInstanceId})),    
    setCountBenefitCalculations: (countBenefitCalculations: number) =>
         set(() => ({countBenefitCalculations})),
     setBenefitCalRequiredFilelds: (benefitCalRequiredFilelds: Array<{
          id: string;
          label: string;
          dataType: 'String' | 'Double' | 'Boolean';
     }>) => set(() => ({benefitCalRequiredFilelds})),
     setbenefitcalFinalResult: (benefitcalFinalResult: object | null) => 
         set(() => ({benefitcalFinalResult})),
     setBulkprocessBatchId: (bulkprocessBatchId: string | null) =>
         set(() => ({bulkprocessBatchId})),
     setBulkprocessBatchStatus: (bulkprocessBatchStatus: string | null) =>
           set(() => ({bulkprocessBatchStatus})),

}));
// export const useStore = create<Store>(
//     (persist as MyPersist)(((set) => ({
//    benefitCalculatorTaskInitiated: false,
//    benefitCalculatorProcessInstanceId: null,
//     setBenefitCalculatorTaskInitiated: (benefitCalculatorTaskInitiated: boolean) => set(() => ({benefitCalculatorTaskInitiated})),
//     setBenefitCalculatorProcessInstanceId: (benefitCalculatorProcessInstanceId: string | null) => set(() => ({benefitCalculatorProcessInstanceId})),    
//     })),
//     {
//         name: 'store',

//     }
// )
// )