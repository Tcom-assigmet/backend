"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';

// Dynamically import components to prevent SSR issues
const BenefitCalculatorResult = dynamic(
  () => import('@/components/forms/benefitCalculatorResult/BenefitCalculatorResultForm'),
  { ssr: false }
);

const BenefitCalculatorForm = dynamic(
  () => import('@/components/forms/benefitCalculatorStartForm/BenefitCalculatorStartForm'),
  { ssr: false }
);

const EnterCalculationDetailsForm = dynamic(
  () => import('@/components/forms/enterCalculationDetailsForm/EnterCalculationDetailsForm'),
  { ssr: false }
);

const BenefitCalculate: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'calculator' | 'details' | 'results'>('calculator');
  
  const {
    setRequiredFields,
    setProcessInstanceId,
    setTaskInitiated,
    resetCalculationCount,
    clearFormValues,
    resetFormData
  } = useStore();

  const cancel = () => {
    setCurrentStep('calculator');
    setRequiredFields([]);
    setProcessInstanceId(null);
    setTaskInitiated(false);
    resetCalculationCount();
  };

  const handleNext = () => {
    if (currentStep === 'calculator') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('results');
    }
  };

  const handleBack = () => {
    if (currentStep === 'results') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('calculator');
    }
  };

  const resetAll = () => {
    setCurrentStep('calculator');
    setRequiredFields([]);
    setProcessInstanceId(null);
    setTaskInitiated(false);
    resetCalculationCount();
    clearFormValues();
    resetFormData();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Benefit Calculator</h1>
          <p className="mt-2 text-gray-600">Calculate member benefits step by step</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${currentStep === 'calculator' ? 'text-blue-600' : currentStep !== 'calculator' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'calculator' ? 'bg-blue-600 text-white' : currentStep !== 'calculator' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Member Info</span>
            </div>
            
            <div className={`flex items-center ${currentStep === 'details' ? 'text-blue-600' : currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'details' ? 'bg-blue-600 text-white' : currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Calculation Details</span>
            </div>
            
            <div className={`flex items-center ${currentStep === 'results' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Results</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {currentStep === 'calculator' && (
            <BenefitCalculatorForm 
              onNext={handleNext}
              onCancel={cancel}
            />
          )}
          
          {currentStep === 'details' && (
            <EnterCalculationDetailsForm 
              onNext={handleNext}
              onBack={handleBack}
              onCancel={cancel}
            />
          )}
          
          {currentStep === 'results' && (
            <BenefitCalculatorResult 
              onBack={handleBack}
              onReset={resetAll}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BenefitCalculate;