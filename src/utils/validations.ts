import { differenceInYears, isValid, isBefore } from 'date-fns';

import { VALIDATION_RULES, ERROR_MESSAGES, UI_CONSTANTS } from '@/constants';
import type { 
  BenefitCalculatorFormData, 
  ValidationErrors,
  FormValue 
} from '@/types/benefitcalculator';

/**
 * Validates a member ID against the required pattern
 */
export const validateMemberId = (memberId: string): string | null => {
  if (!memberId?.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (!VALIDATION_RULES.MEMBER_ID_PATTERN.test(memberId)) {
    return ERROR_MESSAGES.INVALID_MEMBER_ID;
  }

  return null;
};

/**
 * Validates age based on birth date
 */
export const validateAge = (birthDate: Date | null): string | null => {
  if (!birthDate) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (!isValid(birthDate)) {
    return ERROR_MESSAGES.INVALID_DATE;
  }

  const age = differenceInYears(new Date(), birthDate);
  
  if (age < VALIDATION_RULES.MIN_AGE || age > VALIDATION_RULES.MAX_AGE) {
    return ERROR_MESSAGES.INVALID_AGE;
  }

  return null;
};

/**
 * Validates that end date is after start date
 */
export const validateDateRange = (
  startDate: Date | null, 
  endDate: Date | null,
  fieldName = 'End date'
): string | null => {
  if (!startDate || !endDate) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (!isValid(startDate) || !isValid(endDate)) {
    return ERROR_MESSAGES.INVALID_DATE;
  }

  if (isBefore(endDate, startDate)) {
    return `${fieldName} must be after start date`;
  }

  return null;
};

/**
 * Validates a required field based on its type
 */
export const validateRequiredField = (
  value: FormValue,
  type: 'string' | 'number' | 'date' | 'boolean'
): string | null => {
  if (value === null || value === undefined) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  switch (type) {
    case 'string':
      return typeof value === 'string' && value.trim().length > 0 
        ? null 
        : ERROR_MESSAGES.REQUIRED_FIELD;
    
    case 'number':
      return typeof value === 'number' && !isNaN(value) 
        ? null 
        : ERROR_MESSAGES.REQUIRED_FIELD;
    
    case 'date':
      return value instanceof Date && isValid(value) 
        ? null 
        : ERROR_MESSAGES.INVALID_DATE;
    
    case 'boolean':
      return typeof value === 'boolean' 
        ? null 
        : ERROR_MESSAGES.REQUIRED_FIELD;
    
    default:
      return ERROR_MESSAGES.REQUIRED_FIELD;
  }
};

/**
 * Validates name fields (first name, last name)
 */
export const validateName = (name: string, fieldName: string): string | null => {
  if (!name?.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (name.trim().length < VALIDATION_RULES.MIN_NAME_LENGTH) {
    return `${fieldName} must be at least ${VALIDATION_RULES.MIN_NAME_LENGTH} characters`;
  }

  if (name.trim().length > VALIDATION_RULES.MAX_NAME_LENGTH) {
    return `${fieldName} must be no more than ${VALIDATION_RULES.MAX_NAME_LENGTH} characters`;
  }

  return null;
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): string | null => {
  if (!email?.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }

  return null;
};

/**
 * Validates file upload
 */
export const validateFile = (file: File | null): string | null => {
  if (!file) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (file.size > UI_CONSTANTS.MAX_FILE_SIZE) {
    return ERROR_MESSAGES.FILE_TOO_LARGE;
  }

  const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  if (!UI_CONSTANTS.ALLOWED_FILE_TYPES.includes(fileExtension as any)) {
    return ERROR_MESSAGES.INVALID_FILE_TYPE;
  }

  return null;
};

/**
 * Comprehensive form data validation
 */
export const validateFormData = (formData: BenefitCalculatorFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate names
  const firstNameError = validateName(formData.firstName, 'First name');
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateName(formData.lastName, 'Last name');
  if (lastNameError) errors.lastName = lastNameError;

  // Validate member ID
  const memberIdError = validateMemberId(formData.memberId);
  if (memberIdError) errors.memberId = memberIdError;

  // Validate dates
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = ERROR_MESSAGES.REQUIRED_FIELD;
  } else {
    const ageError = validateAge(formData.dateOfBirth);
    if (ageError) errors.ageValidation = ageError;
  }

  if (!formData.dateJoinedFund) {
    errors.dateJoinedFund = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (!formData.effectiveDate) {
    errors.effectiveDate = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (!formData.calculationDate) {
    errors.calculationDate = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  // Validate date logic
  if (formData.dateJoinedFund && formData.effectiveDate) {
    const dateRangeError = validateDateRange(
      formData.dateJoinedFund, 
      formData.effectiveDate,
      'Effective date'
    );
    if (dateRangeError) {
      errors.dateLogic = dateRangeError;
    }
  }

  if (formData.effectiveDate && formData.calculationDate) {
    const calcDateError = validateDateRange(
      formData.effectiveDate,
      formData.calculationDate,
      'Calculation date'
    );
    if (calcDateError) {
      errors.dateLogic = calcDateError;
    }
  }

  // Validate benefit class
  if (!formData.benefitClass?.trim()) {
    errors.benefitClass = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  // Validate payment type
  if (!formData.paymentType?.trim()) {
    errors.paymentType = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  // Validate plan number
  if (!formData.planNumber?.trim()) {
    errors.planNumber = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  return errors;
};

/**
 * Checks if form data has any validation errors
 */
export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * Gets the first validation error message
 */
export const getFirstError = (errors: ValidationErrors): string | null => {
  const errorKeys = Object.keys(errors);
  return errorKeys.length > 0 ? errors[errorKeys[0]!] || null : null;
};

/**
 * Validates a dynamic form field based on configuration
 */
export const validateDynamicField = (
  value: FormValue,
  field: { 
    dataType: string; 
    required: boolean; 
    min?: number; 
    max?: number; 
    pattern?: string;
  }
): string | null => {
  if (field.required && (value === null || value === undefined || value === '')) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (value === null || value === undefined || value === '') {
    return null; // Optional field, no value
  }

  switch (field.dataType.toLowerCase()) {
    case 'string':
      const stringValue = String(value);
      if (field.min && stringValue.length < field.min) {
        return `Minimum length is ${field.min} characters`;
      }
      if (field.max && stringValue.length > field.max) {
        return `Maximum length is ${field.max} characters`;
      }
      if (field.pattern) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(stringValue)) {
          return 'Invalid format';
        }
      }
      break;

    case 'double':
    case 'number':
      const numberValue = Number(value);
      if (isNaN(numberValue)) {
        return 'Must be a valid number';
      }
      if (field.min !== undefined && numberValue < field.min) {
        return `Minimum value is ${field.min}`;
      }
      if (field.max !== undefined && numberValue > field.max) {
        return `Maximum value is ${field.max}`;
      }
      break;

    case 'date':
      if (!(value instanceof Date) || !isValid(value)) {
        return ERROR_MESSAGES.INVALID_DATE;
      }
      break;

    case 'boolean':
      if (typeof value !== 'boolean') {
        return 'Must be true or false';
      }
      break;

    default:
      return null;
  }

  return null;
};