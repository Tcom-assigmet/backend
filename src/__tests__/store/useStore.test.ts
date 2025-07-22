import { renderHook, act } from '@testing-library/react';
import { useBenefitCalculatorStore } from '@/store/useStore';
import type { BenefitCalculatorFormData, BenefitCalFinalResult } from '@/types/benefitcalculator';
import { PROCESS_STATUS } from '@/constants';

// Mock zustand to use actual implementation in tests
jest.unmock('zustand');

describe('useBenefitCalculatorStore', () => {
  const mockFormData: BenefitCalculatorFormData = {
    firstName: 'John',
    lastName: 'Doe',
    memberId: 'ABC123',
    dateOfBirth: new Date('1990-01-01'),
    dateJoinedFund: new Date('2020-01-01'),
    effectiveDate: new Date('2023-01-01'),
    calculationDate: new Date('2024-01-01'),
    benefitClass: 'Class A',
    paymentType: 'Monthly',
    planNumber: 'PLAN001',
  };

  const mockFinalResult: BenefitCalFinalResult = {
    success: true,
    memberData: {
      firstName: 'John',
      lastName: 'Doe',
      memberId: 'ABC123',
    },
    subProcessData: {
      pymntAmt: '1000.00',
    },
    timestamp: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useBenefitCalculatorStore());
    act(() => {
      result.current.resetStore();
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      expect(result.current.formData.firstName).toBe('');
      expect(result.current.formData.lastName).toBe('');
      expect(result.current.formData.memberId).toBe('');
      expect(result.current.formData.dateOfBirth).toBeNull();
      expect(result.current.formValues).toBeNull();
      expect(result.current.taskInitiated).toBe(false);
      expect(result.current.processInstanceId).toBeNull();
      expect(result.current.calculationCount).toBe(0);
      expect(result.current.isResultModalOpen).toBe(false);
      expect(result.current.requiredFields).toEqual([]);
      expect(result.current.finalResult).toBeNull();
      expect(result.current.bulkProcess.batchId).toBeNull();
      expect(result.current.bulkProcess.status).toBeNull();
      expect(result.current.loading.calculation).toBe(false);
      expect(result.current.loading.bulkProcess).toBe(false);
      expect(result.current.loading.fieldsFetch).toBe(false);
      expect(result.current.errors.calculation).toBeNull();
      expect(result.current.errors.bulkProcess).toBeNull();
      expect(result.current.errors.validation).toEqual({});
    });
  });

  describe('Form Data Actions', () => {
    it('should set form data', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setFormData(mockFormData);
      });

      expect(result.current.formData).toEqual(mockFormData);
    });

    it('should reset form data', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setFormData(mockFormData);
        result.current.resetFormData();
      });

      expect(result.current.formData.firstName).toBe('');
      expect(result.current.formData.lastName).toBe('');
      expect(result.current.formData.memberId).toBe('');
    });

    it('should update individual form field', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.updateFormField('firstName', 'Jane');
        result.current.updateFormField('memberId', 'XYZ789');
      });

      expect(result.current.formData.firstName).toBe('Jane');
      expect(result.current.formData.memberId).toBe('XYZ789');
    });
  });

  describe('Form Values Actions', () => {
    it('should set form values', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());
      const formValues = { field1: 'value1', field2: 'value2' };

      act(() => {
        result.current.setFormValues(formValues);
      });

      expect(result.current.formValues).toEqual(formValues);
    });

    it('should clear form values', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());
      const formValues = { field1: 'value1', field2: 'value2' };

      act(() => {
        result.current.setFormValues(formValues);
        result.current.clearFormValues();
      });

      expect(result.current.formValues).toBeNull();
    });

    it('should update individual form value', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.updateFormValue('dynamicField1', 'test value');
        result.current.updateFormValue('dynamicField2', 123);
      });

      expect(result.current.formValues).toEqual({
        dynamicField1: 'test value',
        dynamicField2: 123,
      });
    });
  });

  describe('Task Management Actions', () => {
    it('should set task initiated', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setTaskInitiated(true);
      });

      expect(result.current.taskInitiated).toBe(true);
    });

    it('should set process instance ID', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());
      const processId = 'process-123';

      act(() => {
        result.current.setProcessInstanceId(processId);
      });

      expect(result.current.processInstanceId).toBe(processId);
    });

    it('should increment calculation count', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.incrementCalculationCount();
        result.current.incrementCalculationCount();
      });

      expect(result.current.calculationCount).toBe(2);
    });

    it('should reset calculation count', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.incrementCalculationCount();
        result.current.incrementCalculationCount();
        result.current.resetCalculationCount();
      });

      expect(result.current.calculationCount).toBe(0);
    });
  });

  describe('Results Actions', () => {
    it('should set result modal open', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setResultModalOpen(true);
      });

      expect(result.current.isResultModalOpen).toBe(true);
    });

    it('should set required fields', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());
      const fields = [
        { id: 'field1', label: 'Field 1', dataType: 'String' as const, required: true },
        { id: 'field2', label: 'Field 2', dataType: 'Number' as const, required: false },
      ];

      act(() => {
        result.current.setRequiredFields(fields);
      });

      expect(result.current.requiredFields).toEqual(fields);
    });

    it('should set final result', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setFinalResult(mockFinalResult);
      });

      expect(result.current.finalResult).toEqual(mockFinalResult);
    });
  });

  describe('Bulk Processing Actions', () => {
    it('should set bulk process batch ID', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());
      const batchId = 'batch-123';

      act(() => {
        result.current.setBulkProcessBatchId(batchId);
      });

      expect(result.current.bulkProcess.batchId).toBe(batchId);
    });

    it('should set bulk process status', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setBulkProcessStatus(PROCESS_STATUS.PROCESSING);
      });

      expect(result.current.bulkProcess.status).toBe(PROCESS_STATUS.PROCESSING);
    });

    it('should reset bulk process', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setBulkProcessBatchId('batch-123');
        result.current.setBulkProcessStatus(PROCESS_STATUS.PROCESSING);
        result.current.resetBulkProcess();
      });

      expect(result.current.bulkProcess.batchId).toBeNull();
      expect(result.current.bulkProcess.status).toBeNull();
    });
  });

  describe('Loading Actions', () => {
    it('should set calculation loading', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setCalculationLoading(true);
      });

      expect(result.current.loading.calculation).toBe(true);
    });

    it('should set bulk process loading', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setBulkProcessLoading(true);
      });

      expect(result.current.loading.bulkProcess).toBe(true);
    });

    it('should set fields fetch loading', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setFieldsFetchLoading(true);
      });

      expect(result.current.loading.fieldsFetch).toBe(true);
    });
  });

  describe('Error Actions', () => {
    it('should set calculation error', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());
      const error = 'Calculation failed';

      act(() => {
        result.current.setCalculationError(error);
      });

      expect(result.current.errors.calculation).toBe(error);
    });

    it('should set bulk process error', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());
      const error = 'Bulk process failed';

      act(() => {
        result.current.setBulkProcessError(error);
      });

      expect(result.current.errors.bulkProcess).toBe(error);
    });

    it('should set validation error', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setValidationError('firstName', 'First name is required');
        result.current.setValidationError('lastName', 'Last name is required');
      });

      expect(result.current.errors.validation).toEqual({
        firstName: 'First name is required',
        lastName: 'Last name is required',
      });
    });

    it('should clear validation error', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setValidationError('firstName', 'First name is required');
        result.current.setValidationError('firstName', null);
      });

      expect(result.current.errors.validation.firstName).toBeUndefined();
    });

    it('should clear validation errors', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setValidationError('firstName', 'First name is required');
        result.current.setValidationError('lastName', 'Last name is required');
        result.current.clearValidationErrors();
      });

      expect(result.current.errors.validation).toEqual({});
    });

    it('should clear all errors', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        result.current.setCalculationError('Calculation error');
        result.current.setBulkProcessError('Bulk process error');
        result.current.setValidationError('firstName', 'Validation error');
        result.current.clearAllErrors();
      });

      expect(result.current.errors.calculation).toBeNull();
      expect(result.current.errors.bulkProcess).toBeNull();
      expect(result.current.errors.validation).toEqual({});
    });
  });

  describe('Reset Actions', () => {
    it('should reset entire store', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      // Set some state
      act(() => {
        result.current.setFormData(mockFormData);
        result.current.setTaskInitiated(true);
        result.current.setBulkProcessBatchId('batch-123');
        result.current.setCalculationError('Some error');
        result.current.resetStore();
      });

      // Verify state is reset
      expect(result.current.formData.firstName).toBe('');
      expect(result.current.taskInitiated).toBe(false);
      expect(result.current.bulkProcess.batchId).toBeNull();
      expect(result.current.errors.calculation).toBeNull();
    });
  });

  describe('Complex State Updates', () => {
    it('should handle complex workflow', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        // Start calculation
        result.current.setFormData(mockFormData);
        result.current.setCalculationLoading(true);
        result.current.setTaskInitiated(true);
        result.current.setProcessInstanceId('process-123');
      });

      expect(result.current.loading.calculation).toBe(true);
      expect(result.current.taskInitiated).toBe(true);
      expect(result.current.processInstanceId).toBe('process-123');

      act(() => {
        // Complete calculation
        result.current.setCalculationLoading(false);
        result.current.setFinalResult(mockFinalResult);
        result.current.setResultModalOpen(true);
        result.current.incrementCalculationCount();
      });

      expect(result.current.loading.calculation).toBe(false);
      expect(result.current.finalResult).toEqual(mockFinalResult);
      expect(result.current.isResultModalOpen).toBe(true);
      expect(result.current.calculationCount).toBe(1);
    });

    it('should handle error scenarios', () => {
      const { result } = renderHook(() => useBenefitCalculatorStore());

      act(() => {
        // Start calculation with validation errors
        result.current.setValidationError('firstName', 'Required');
        result.current.setValidationError('memberId', 'Invalid format');
      });

      expect(Object.keys(result.current.errors.validation)).toHaveLength(2);

      act(() => {
        // Fix validation and start calculation
        result.current.clearValidationErrors();
        result.current.setCalculationLoading(true);
      });

      expect(result.current.errors.validation).toEqual({});
      expect(result.current.loading.calculation).toBe(true);

      act(() => {
        // Calculation fails
        result.current.setCalculationLoading(false);
        result.current.setCalculationError('Server error');
      });

      expect(result.current.loading.calculation).toBe(false);
      expect(result.current.errors.calculation).toBe('Server error');
    });
  });
});