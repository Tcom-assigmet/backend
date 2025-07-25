
import { StartProcessRequest, ValidationError } from "../models/types";

export class ValidationService {
  validateStartProcessRequest(request: StartProcessRequest): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!request.firstName?.trim()) {
      errors.push({
        field: 'firstName',
        message: 'First name is required',
        code: 'REQUIRED'
      });
    }

    if (!request.lastName?.trim()) {
      errors.push({
        field: 'lastName',
        message: 'Last name is required',
        code: 'REQUIRED'
      });
    }

    if (!request.memberId?.trim()) {
      errors.push({
        field: 'memberId',
        message: 'Member ID is required',
        code: 'REQUIRED'
      });
    }

    if (!request.dateOfBirth) {
      errors.push({
        field: 'dateOfBirth',
        message: 'Date of birth is required',
        code: 'REQUIRED'
      });
    } else if (!this.isValidDate(request.dateOfBirth)) {
      errors.push({
        field: 'dateOfBirth',
        message: 'Invalid date format',
        code: 'INVALID_FORMAT'
      });
    }

    if (!request.effectiveDate) {
      errors.push({
        field: 'effectiveDate',
        message: 'Effective date is required',
        code: 'REQUIRED'
      });
    } else if (!this.isValidDate(request.effectiveDate)) {
      errors.push({
        field: 'effectiveDate',
        message: 'Invalid date format',
        code: 'INVALID_FORMAT'
      });
    }

    if (!request.benefitClass?.trim()) {
      errors.push({
        field: 'benefitClass',
        message: 'Benefit class is required',
        code: 'REQUIRED'
      });
    }

    return errors;
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
}

export const validationService = new ValidationService();