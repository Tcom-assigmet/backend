"use client"
import React, { useState } from 'react';
import { useStore } from '@/src/store/useStore';
import BenefitCalculatorResult from '@/src/components/forms/benefitCalculatorResult/BenefitCalculatorResultForm';
import BenefitCalculatorForm from '@/src/components/forms/benefitCalculatorStartForm/BenefitCalculatorStartForm';
import EnterCalculationDetailsForm from '@/src/components/forms/enterCalculationDetailsForm/EnterCalculationDetailsForm';

const BenefitCalculate: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'calculator' | 'details' | 'results'>('calculator');
  
  const {
    setBenefitCalRequiredFilelds,
    setBenefitCalculatorProcessInstanceId,
    setBenefitCalculatorTaskInitiated,
    setCountBenefitCalculations,clearBenefitCalculatorFormValues,resetBenefitCalculatorFormData
  } = useStore();

  const cancel = () => {
    setCurrentStep('calculator');
    setBenefitCalRequiredFilelds([]);
    setBenefitCalculatorProcessInstanceId(null);
    setBenefitCalculatorTaskInitiated(false);
    setCountBenefitCalculations(0);
  };

  const handleNext = () => {
    if (currentStep === 'calculator') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('results');
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('calculator');
    } else if (currentStep === 'results') {
      setCurrentStep('details');
    }
  };

  const handleStartNew = () => {
    setCurrentStep('calculator');
    setBenefitCalRequiredFilelds([]);
    setBenefitCalculatorProcessInstanceId(null);
    setBenefitCalculatorTaskInitiated(false);
    setCountBenefitCalculations(0);
    clearBenefitCalculatorFormValues();
    resetBenefitCalculatorFormData();
  };

  const renderHeader = (title: string, showStartNew: boolean = false) => (
    <div className="mb-6 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <div className="flex gap-2">
        {showStartNew && (
          <button
            onClick={handleStartNew}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Start New Process
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-max p-6 bg-[#EAEFEF]">
      {currentStep === 'calculator' && (
        <div className="w-full">
          {renderHeader('Standard Calculator')}
          <BenefitCalculatorForm onClose={cancel} onNext={handleNext} />
        </div>
      )}

      {currentStep === 'details' && (
        <div className="w-full">
          {renderHeader('Calculation Details')}
          <EnterCalculationDetailsForm 
            onCancel={cancel}
            onComplete={handleNext}
            onBack={handleBack}
          />
        </div>
      )}

      {currentStep === 'results' && (
        <div className="w-full">
          {renderHeader('Calculation Results', true)}
          <BenefitCalculatorResult />
        </div>
      )}
    </div>
  );
};

export default BenefitCalculate;