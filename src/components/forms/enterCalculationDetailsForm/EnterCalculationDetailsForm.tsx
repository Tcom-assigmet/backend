"use client"
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { FormDataProcessor } from '@/utils/FormDataProcessor';
import { useFormValidation } from '@/hooks/useFormValidation';
import { VALIDATION_MESSAGES } from '@/config/benefitCalculatorConfigs';
import { ErrorDisplay } from '../ErrorDisplay';
import { EnterCalculationDetailFormField } from './sections/CalculationFormFiled';
import { FormValue } from '@/types/benefitcalculator';
import { BenefitCalculatorCompleteService } from './services/calculation-service';



const useApiService = () => {
  return useMemo(() => new BenefitCalculatorCompleteService(), []);
};

interface EnterCalculationDetailsFormProps {
   onComplete: () => void; 
  onCancel: () => void;
  onBack?: () => void;
}

const EnterCalculationDetailsForm: React.FC<EnterCalculationDetailsFormProps> = ({ 
  onComplete, 
  onCancel,
  onBack 
}) => {

  const { 
    setOpenResultforBenefitCalculator,
    benefitCalculatorProcessInstanceId,
    setBenefitCalculatorTaskInitiated,
    benefitCalRequiredFilelds,
    setCountBenefitCalculations,
    countBenefitCalculations,
    setbenefitcalFinalResult,
    // Add these new state management functions to your store
    benefitCalculatorFormValues,
    setBenefitCalculatorFormValues,
    clearBenefitCalculatorFormValues
  } = useStore();

  // Initialize form values from store or empty object
  const [formValues, setFormValues] = useState<Record<string, FormValue>>(
    benefitCalculatorFormValues || {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { 
    errors, 
    touched, 
    validateField, 
    validateForm, 
    clearErrors, 
    markFieldTouched,
    isFormValid
  } = useFormValidation(benefitCalRequiredFilelds);
  const apiService = useApiService();

  // Save form values to store whenever they change
  useEffect(() => {
    setBenefitCalculatorFormValues(formValues);
  }, [formValues, setBenefitCalculatorFormValues]);

  const canSubmit = useMemo(() => {
    return isFormValid(formValues) && !isSubmitting;
  }, [isFormValid, formValues, isSubmitting]);

  // Event handlers
  const handleInputChange = useCallback((id: string, value: FormValue) => {
    setFormValues(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Validate field immediately for real-time feedback
    validateField(id, value);
    
    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  }, [validateField, submitError]);

  const handleFieldBlur = useCallback((fieldId: string) => {
    markFieldTouched(fieldId);
    validateField(fieldId, formValues[fieldId]);
  }, [validateField, formValues, markFieldTouched]);

  const handleBack = useCallback(() => {
    // Form values are already saved in store via useEffect
    onBack?.();
  }, [onBack]);

  const handleCancel = useCallback(() => {
    // Clear stored form values when canceling
    clearBenefitCalculatorFormValues();
    onCancel();
  }, [onCancel, clearBenefitCalculatorFormValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    benefitCalRequiredFilelds.forEach(field => {
      markFieldTouched(field.id);
    });
    
    // Validate form
    if (!validateForm(formValues)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Ensure processInstanceId is available
      if (!benefitCalculatorProcessInstanceId) {
        setSubmitError('Process Instance ID is missing.');
        setIsSubmitting(false);
        return;
      }

      // Process form data
      const processedValues = FormDataProcessor.processFormValues(benefitCalRequiredFilelds, formValues);
      // Prepare submission data using the helper to match FormSubmissionData interface
      const submissionData = FormDataProcessor.prepareSubmissionData(
        benefitCalculatorProcessInstanceId,
        benefitCalRequiredFilelds,
        processedValues
      );

      // Submit to API
      const result = await apiService.submitCalculation(submissionData);
      
      // Update store state
      setbenefitcalFinalResult(result);
      setBenefitCalculatorTaskInitiated(false);
      setCountBenefitCalculations(countBenefitCalculations + 1);
      setOpenResultforBenefitCalculator(true);
      
      // Clear stored form values after successful submission
      clearBenefitCalculatorFormValues();
      
      // Close form
      onComplete?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(VALIDATION_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = useCallback(() => {
    setSubmitError(null);
    clearErrors();
  }, [clearErrors]);

  // Show error state
  if (submitError) {
    return <ErrorDisplay error={submitError} onRetry={handleRetry} />;
  }

  // Main form render
  return (
    <div className="bg-white rounded-md shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Equip Benefit Calculator</h2>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefitCalRequiredFilelds.map((field) => (
            <EnterCalculationDetailFormField
              key={field.id}
              field={field}
              value={formValues[field.id]}
              error={errors[field.id]}
              touched={touched[field.id]}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
            />
          ))}
        </div>
        
        <div className="mt-8 flex justify-between">
          {/* Left side - Back button */}
          <div className="flex space-x-4">
            {onBack && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
          </div>

          {/* Right side - Cancel and Submit buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 transition-colors flex items-center ${
                canSubmit 
                  ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EnterCalculationDetailsForm;