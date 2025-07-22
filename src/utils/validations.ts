import { FormData } from "@/src/types/benefitcalculator";
import { format } from "date-fns";

export const validateName = (name: string, fieldName: string): string | undefined => {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }
  if (name.trim().length > 50) {
    return `${fieldName} must not exceed 50 characters`;
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return undefined;
};

export const validateMemberId = (memberId: string): string | undefined => {
  if (!memberId.trim()) {
    return 'Member ID is required';
  }
  if (memberId.trim().length < 3) {
    return 'Member ID must be at least 3 characters long';
  }
  if (memberId.trim().length > 20) {
    return 'Member ID must not exceed 20 characters';
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(memberId.trim())) {
    return 'Member ID can only contain letters, numbers, hyphens, and underscores';
  }
  const hasAtLeastOneDigit = /\d/.test(memberId);
  if (!hasAtLeastOneDigit) {
    return 'Member ID must contain at least one number';
  }
  return undefined;
};

export const validateDate = (date: Date | undefined, fieldName: string, minDate?: Date, maxDate?: Date): string | undefined => {
  if (!date) {
    return `${fieldName} is required`;
  }
  
  if (isNaN(date.getTime())) {
    return `${fieldName} is not a valid date`;
  }
  
  if (minDate && date < minDate) {
    return `${fieldName} cannot be before ${format(minDate, 'MM/dd/yyyy')}`;
  }
  
  if (maxDate && date > maxDate) {
    return `${fieldName} cannot be after ${format(maxDate, 'MM/dd/yyyy')}`;
  }
  
  return undefined;
};

export const validateDateLogic = (formData: FormData): string | undefined => {
  const { dateOfBirth, dateJoinedFund, effectiveDate, calculationDate } = formData;
  
  if (!dateOfBirth || !dateJoinedFund || !effectiveDate || !calculationDate) {
    return undefined;
  }
  
  if (dateJoinedFund <= dateOfBirth) {
    return 'Date Joined Fund must be after Date of Birth';
  }
  
  if (effectiveDate < dateJoinedFund) {
    return 'Effective Date cannot be before Date Joined Fund';
  }
  
  if (calculationDate < effectiveDate) {
    return 'Calculation Date cannot be before Effective Date';
  }
  
  return undefined;
};