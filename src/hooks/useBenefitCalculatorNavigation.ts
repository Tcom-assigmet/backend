
import { useStore } from "@/src/store/useStore";
import { useEffect, useState } from "react";
type Step = 'home' | 'standard' | 'bulk' | 'details' | 'results';
export const useBenefitCalculatorNavigation = () => {
  const [currentStep, setCurrentStep] = useState<Step>('home');
  const {
    benefitCalculatorProcessInstanceId,
    openResultforBenefitCalculator,
    setBenefitCalculatorProcessInstanceId,
    setBenefitCalRequiredFilelds,
    setOpenResultforBenefitCalculator,
    setbenefitcalFinalResult
  } = useStore();

  const navigateToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const handleProcessStart = (type: 'standard' | 'bulk') => {
    setCurrentStep(type);
  };

  const handleNextStep = () => {
    if (currentStep === 'standard' && benefitCalculatorProcessInstanceId) {
      setCurrentStep('details');
    } else if (currentStep === 'details' || currentStep === 'bulk') {
      if (openResultforBenefitCalculator) {
        setCurrentStep('results');
      }
    }
  };

  const resetProcess = () => {
    setCurrentStep('home');
    setBenefitCalculatorProcessInstanceId(null);
    setBenefitCalRequiredFilelds([]);
    setOpenResultforBenefitCalculator(false);
    setbenefitcalFinalResult(null);
  };

  const handleClose = () => {
    setCurrentStep('home');
  };

  // Auto-navigation effects
  useEffect(() => {
    if (benefitCalculatorProcessInstanceId && currentStep === 'standard') {
      setCurrentStep('details');
    }
  }, [benefitCalculatorProcessInstanceId, currentStep]);

  useEffect(() => {
    if (openResultforBenefitCalculator && (currentStep === 'details' || currentStep === 'bulk')) {
      setCurrentStep('results');
    }
  }, [openResultforBenefitCalculator, currentStep]);

  return {
    currentStep,
    navigateToStep,
    handleProcessStart,
    handleNextStep,
    resetProcess,
    handleClose
  };
};