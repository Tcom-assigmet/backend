import { useCallback, useState } from "react";
import { FormErrors, FormValue, RequiredField } from "../types/benefitcalculator";
import { VALIDATION_MESSAGES } from "../configs/benefitCalculatorConfigs";


export const useFormValidation = (fields: RequiredField[]) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((fieldId: string, value: FormValue) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const error = FormValidator.validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [fieldId]: error || ''
    }));
  }, [fields]);

  const validateForm = useCallback((formValues: Record<string, FormValue>) => {
    const newErrors = FormValidator.validateForm(fields, formValues);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const markFieldTouched = useCallback((fieldId: string) => {
    setTouched(prev => ({
      ...prev,
      [fieldId]: true
    }));
  }, []);

  const isFormValid = useCallback((formValues: Record<string, FormValue>) => {
    return FormValidator.isFormValid(fields, formValues);
  }, [fields]);

  return { 
    errors, 
    touched, 
    validateField, 
    validateForm, 
    clearErrors, 
    markFieldTouched,
    isFormValid
  };
};


class FormValidator {
  static validateField(field: RequiredField, value: FormValue): string | null {
    // Make all fields required by default
    const isRequired = field.required !== false; // Default to true unless explicitly set to false
    
    // Required field validation
    if (isRequired && this.isEmpty(value)) {
      return VALIDATION_MESSAGES.REQUIRED;
    }

    // Skip further validation if field is empty and not required
    if (this.isEmpty(value)) {
      return null;
    }

    // Type-specific validation
    switch (field.dataType) {
      case 'Double':
        return this.validateNumber(value, field);
      case 'String':
        return this.validateString(value, field);
      case 'Date':
        return this.validateDate(value);
      case 'Boolean':
        return null; // Boolean fields don't need additional validation
      default:
        return null;
    }
  }

  private static isEmpty(value: FormValue): boolean {
    if (value === null || value === undefined || value === '') {
      return true;
    }
    // For boolean fields, false is a valid value
    if (typeof value === 'boolean') {
      return false;
    }
    return false;
  }

  private static validateNumber(value: FormValue, field: RequiredField): string | null {
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      return VALIDATION_MESSAGES.INVALID_NUMBER;
    }

    if (field.min !== undefined && numValue < field.min) {
      return VALIDATION_MESSAGES.MIN_VALUE(field.min);
    }

    if (field.max !== undefined && numValue > field.max) {
      return VALIDATION_MESSAGES.MAX_VALUE(field.max);
    }

    return null;
  }

  private static validateString(value: FormValue, field: RequiredField): string | null {
    const stringValue = String(value);

    if (field.pattern) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(stringValue)) {
        // Common patterns
        if (field.pattern.includes('@')) {
          return VALIDATION_MESSAGES.INVALID_EMAIL;
        }
        return `Invalid format for ${field.label}`;
      }
    }

    return null;
  }

  private static validateDate(value: FormValue): string | null {
    if (value && isNaN(Date.parse(String(value)))) {
      return VALIDATION_MESSAGES.INVALID_DATE;
    }
    return null;
  }

  static validateForm(fields: RequiredField[], formValues: Record<string, FormValue>): FormErrors {
    const errors: FormErrors = {};

    fields.forEach(field => {
      const error = this.validateField(field, formValues[field.id]);
      if (error) {
        errors[field.id] = error;
      }
    });

    return errors;
  }

  static isFormValid(fields: RequiredField[], formValues: Record<string, FormValue>): boolean {
    const errors = this.validateForm(fields, formValues);
    return Object.keys(errors).length === 0;
  }
}