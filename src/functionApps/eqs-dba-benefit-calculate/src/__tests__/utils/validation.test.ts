import { ValidationService, validationService } from '../../utils/validation';
import { StartProcessRequest, ValidationError } from '../../models/types';

describe('ValidationService', () => {
  let validation: ValidationService;

  beforeEach(() => {
    validation = new ValidationService();
  });

  describe('validateStartProcessRequest', () => {
    const validRequest: StartProcessRequest = {
      firstName: 'John',
      lastName: 'Doe',
      memberId: 'MEM123',
      dateOfBirth: '1990-01-01',
      dateJoinedFund: '2020-01-01',
      effectiveDate: '2024-01-01',
      calculationDate: '2024-01-01',
      benefitClass: 'Standard',
      paymentType: 'Monthly',
      planNumber: 'PLAN001',
      paymentTypeDesc: 'Monthly Payment'
    };

    it('should return no errors for valid request', () => {
      const errors = validation.validateStartProcessRequest(validRequest);
      expect(errors).toEqual([]);
    });

    it('should return error when firstName is missing', () => {
      const request = { ...validRequest, firstName: '' };
      const errors = validation.validateStartProcessRequest(request);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'firstName',
        message: 'First name is required',
        code: 'REQUIRED'
      });
    });

    it('should return error when firstName is only whitespace', () => {
      const request = { ...validRequest, firstName: '   ' };
      const errors = validation.validateStartProcessRequest(request);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('firstName');
    });

    it('should return error when lastName is missing', () => {
      const request = { ...validRequest, lastName: '' };
      const errors = validation.validateStartProcessRequest(request);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'lastName',
        message: 'Last name is required',
        code: 'REQUIRED'
      });
    });

    it('should return error when memberId is missing', () => {
      const request = { ...validRequest, memberId: '' };
      const errors = validation.validateStartProcessRequest(request);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'memberId',
        message: 'Member ID is required',
        code: 'REQUIRED'
      });
    });

    it('should return error when dateOfBirth is missing', () => {
      const request = { ...validRequest, dateOfBirth: undefined as any };
      const errors = validation.validateStartProcessRequest(request);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'dateOfBirth',
        message: 'Date of birth is required',
        code: 'REQUIRED'
      });
    });

    it('should return error when dateOfBirth is invalid', () => {
      const request = { ...validRequest, dateOfBirth: 'invalid-date' };
      const errors = validation.validateStartProcessRequest(request);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'dateOfBirth',
        message: 'Invalid date format',
        code: 'INVALID_FORMAT'
      });
    });

    it('should return error when effectiveDate is missing', () => {
      const request = { ...validRequest, effectiveDate: undefined as any };
      const errors = validation.validateStartProcessRequest(request);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'effectiveDate',
        message: 'Effective date is required',
        code: 'REQUIRED'
      });
    });

    it('should return error when effectiveDate is invalid', () => {
      const request = { ...validRequest, effectiveDate: 'not-a-date' };
      const errors = validation.validateStartProcessRequest(request);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'effectiveDate',
        message: 'Invalid date format',
        code: 'INVALID_FORMAT'
      });
    });

    it('should return error when benefitClass is missing', () => {
      const request = { ...validRequest, benefitClass: '' };
      const errors = validation.validateStartProcessRequest(request);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'benefitClass',
        message: 'Benefit class is required',
        code: 'REQUIRED'
      });
    });

    it('should return multiple errors for multiple missing fields', () => {
      const request: StartProcessRequest = {
        firstName: '',
        lastName: '',
        memberId: '',
        dateOfBirth: undefined as any,
        dateJoinedFund: '2020-01-01',
        effectiveDate: 'invalid-date',
        calculationDate: '2024-01-01',
        benefitClass: '',
        paymentType: 'Monthly',
        planNumber: 'PLAN001',
        paymentTypeDesc: 'Monthly Payment'
      };

      const errors = validation.validateStartProcessRequest(request);
      
      expect(errors).toHaveLength(6); // firstName, lastName, memberId, dateOfBirth, effectiveDate, benefitClass
      expect(errors.map(e => e.field)).toContain('firstName');
      expect(errors.map(e => e.field)).toContain('lastName');
      expect(errors.map(e => e.field)).toContain('memberId');
      expect(errors.map(e => e.field)).toContain('dateOfBirth');
      expect(errors.map(e => e.field)).toContain('effectiveDate');
      expect(errors.map(e => e.field)).toContain('benefitClass');
    });

    it('should accept valid date formats', () => {
      const validDates = [
        '2024-01-01',
        '2024-12-31',
        '1990-06-15',
        '2000-02-29' // leap year
      ];

      validDates.forEach(date => {
        const request = { ...validRequest, dateOfBirth: date, effectiveDate: date };
        const errors = validation.validateStartProcessRequest(request);
        expect(errors.filter(e => e.field === 'dateOfBirth' || e.field === 'effectiveDate')).toHaveLength(0);
      });
    });

    it('should reject invalid date formats', () => {
      const invalidDates = [
        'invalid-date',
        'not-a-date',
        '2024-13-01', // invalid month
        '2024-01-32', // invalid day
      ];

      invalidDates.forEach(date => {
        const request = { ...validRequest, dateOfBirth: date, effectiveDate: date };
        const errors = validation.validateStartProcessRequest(request);
        const dateErrors = errors.filter(e => e.field === 'dateOfBirth' || e.field === 'effectiveDate');
        expect(dateErrors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validationService singleton', () => {
    it('should export a singleton instance', () => {
      expect(validationService).toBeInstanceOf(ValidationService);
    });

    it('should work with the singleton instance', () => {
      const validRequest: StartProcessRequest = {
        firstName: 'John',
        lastName: 'Doe',
        memberId: 'MEM123',
        dateOfBirth: '1990-01-01',
        dateJoinedFund: '2020-01-01',
        effectiveDate: '2024-01-01',
        calculationDate: '2024-01-01',
        benefitClass: 'Standard',
        paymentType: 'Monthly',
        planNumber: 'PLAN001',
        paymentTypeDesc: 'Monthly Payment'
      };

      const errors = validationService.validateStartProcessRequest(validRequest);
      expect(errors).toEqual([]);
    });
  });
});