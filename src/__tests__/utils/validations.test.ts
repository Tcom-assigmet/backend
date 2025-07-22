import {
  validateFormData,
  validateMemberId,
  validateAge,
  validateDateRange,
  validateRequiredField,
} from '@/utils/validations';
import { VALIDATION_RULES, ERROR_MESSAGES } from '@/constants';
import type { BenefitCalculatorFormData } from '@/types/benefitcalculator';

describe('Validation Utils', () => {
  describe('validateMemberId', () => {
    it('should validate correct member ID format', () => {
      const validIds = ['ABC123', 'XYZ789ABC', '123456'];
      
      validIds.forEach(id => {
        expect(validateMemberId(id)).toBeNull();
      });
    });

    it('should reject invalid member ID formats', () => {
      const invalidIds = ['abc123', '12345', 'ABCDEFGHIJKLM', '123-456', 'AB@123'];
      
      invalidIds.forEach(id => {
        expect(validateMemberId(id)).toBe(ERROR_MESSAGES.INVALID_MEMBER_ID);
      });
    });

    it('should reject empty member ID', () => {
      expect(validateMemberId('')).toBe(ERROR_MESSAGES.REQUIRED_FIELD);
    });
  });

  describe('validateAge', () => {
    it('should validate age within range', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25); // 25 years old
      
      expect(validateAge(birthDate)).toBeNull();
    });

    it('should reject age below minimum', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 17); // 17 years old
      
      expect(validateAge(birthDate)).toBe(ERROR_MESSAGES.INVALID_AGE);
    });

    it('should reject age above maximum', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 101); // 101 years old
      
      expect(validateAge(birthDate)).toBe(ERROR_MESSAGES.INVALID_AGE);
    });

    it('should handle null birth date', () => {
      expect(validateAge(null)).toBe(ERROR_MESSAGES.REQUIRED_FIELD);
    });

    it('should handle invalid date', () => {
      expect(validateAge(new Date('invalid'))).toBe(ERROR_MESSAGES.INVALID_DATE);
    });
  });

  describe('validateDateRange', () => {
    it('should validate correct date range', () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-12-31');
      
      expect(validateDateRange(startDate, endDate)).toBeNull();
    });

    it('should reject end date before start date', () => {
      const startDate = new Date('2023-12-31');
      const endDate = new Date('2023-01-01');
      
      expect(validateDateRange(startDate, endDate)).toBe('End date must be after start date');
    });

    it('should handle null dates', () => {
      expect(validateDateRange(null, new Date())).toBe(ERROR_MESSAGES.REQUIRED_FIELD);
      expect(validateDateRange(new Date(), null)).toBe(ERROR_MESSAGES.REQUIRED_FIELD);
    });
  });

  describe('validateRequiredField', () => {
    it('should validate string field', () => {
      expect(validateRequiredField('Test Name', 'string')).toBeNull();
    });

    it('should validate number field', () => {
      expect(validateRequiredField(123, 'number')).toBeNull();
    });

    it('should validate date field', () => {
      expect(validateRequiredField(new Date(), 'date')).toBeNull();
    });

    it('should reject empty string', () => {
      expect(validateRequiredField('', 'string')).toBe(ERROR_MESSAGES.REQUIRED_FIELD);
    });

    it('should reject null values', () => {
      expect(validateRequiredField(null, 'string')).toBe(ERROR_MESSAGES.REQUIRED_FIELD);
    });

    it('should reject undefined values', () => {
      expect(validateRequiredField(undefined, 'string')).toBe(ERROR_MESSAGES.REQUIRED_FIELD);
    });
  });

  describe('validateFormData', () => {
    const validFormData: BenefitCalculatorFormData = {
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

    it('should validate complete form data', () => {
      const errors = validateFormData(validFormData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should validate required fields', () => {
      const incompleteFormData: BenefitCalculatorFormData = {
        ...validFormData,
        firstName: '',
        lastName: '',
        memberId: '',
      };

      const errors = validateFormData(incompleteFormData);
      expect(errors.firstName).toBe(ERROR_MESSAGES.REQUIRED_FIELD);
      expect(errors.lastName).toBe(ERROR_MESSAGES.REQUIRED_FIELD);
      expect(errors.memberId).toBe(ERROR_MESSAGES.REQUIRED_FIELD);
    });

    it('should validate field formats', () => {
      const invalidFormData: BenefitCalculatorFormData = {
        ...validFormData,
        memberId: 'invalid',
        dateOfBirth: new Date('2010-01-01'), // Too young
      };

      const errors = validateFormData(invalidFormData);
      expect(errors.memberId).toBe(ERROR_MESSAGES.INVALID_MEMBER_ID);
      expect(errors.ageValidation).toBe(ERROR_MESSAGES.INVALID_AGE);
    });

    it('should validate date logic', () => {
      const invalidDatesFormData: BenefitCalculatorFormData = {
        ...validFormData,
        dateJoinedFund: new Date('2024-01-01'),
        effectiveDate: new Date('2020-01-01'), // Before join date
      };

      const errors = validateFormData(invalidDatesFormData);
      expect(errors.dateLogic).toBeDefined();
    });

    it('should validate minimum name length', () => {
      const shortNameFormData: BenefitCalculatorFormData = {
        ...validFormData,
        firstName: 'A',
        lastName: 'B',
      };

      const errors = validateFormData(shortNameFormData);
      expect(errors.firstName).toBeDefined();
      expect(errors.lastName).toBeDefined();
    });

    it('should validate maximum name length', () => {
      const longName = 'A'.repeat(VALIDATION_RULES.MAX_NAME_LENGTH + 1);
      const longNameFormData: BenefitCalculatorFormData = {
        ...validFormData,
        firstName: longName,
        lastName: longName,
      };

      const errors = validateFormData(longNameFormData);
      expect(errors.firstName).toBeDefined();
      expect(errors.lastName).toBeDefined();
    });
  });
});