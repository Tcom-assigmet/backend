import {
  validateName,
  validateMemberId,
  validateDate,
  validateDateLogic,
} from '@/src/utils/validations';
import { FormData } from '@/src/types/benefitcalculator';

describe('validations', () => {
  describe('validateName', () => {
    it('should return undefined for valid names', () => {
      expect(validateName('John', 'First Name')).toBeUndefined();
      expect(validateName('Mary-Jane', 'First Name')).toBeUndefined();
      expect(validateName("O'Connor", 'Last Name')).toBeUndefined();
      expect(validateName('De Silva', 'Last Name')).toBeUndefined();
    });

    it('should return error for empty names', () => {
      expect(validateName('', 'First Name')).toBe('First Name is required');
      expect(validateName('   ', 'Last Name')).toBe('Last Name is required');
    });

    it('should return error for names too short', () => {
      expect(validateName('A', 'First Name')).toBe('First Name must be at least 2 characters long');
    });

    it('should return error for names too long', () => {
      const longName = 'A'.repeat(51);
      expect(validateName(longName, 'First Name')).toBe('First Name must not exceed 50 characters');
    });

    it('should return error for invalid characters', () => {
      expect(validateName('John123', 'First Name')).toBe('First Name can only contain letters, spaces, hyphens, and apostrophes');
      expect(validateName('John@Doe', 'First Name')).toBe('First Name can only contain letters, spaces, hyphens, and apostrophes');
      expect(validateName('John.Doe', 'First Name')).toBe('First Name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('should handle names with spaces correctly', () => {
      expect(validateName('  John  ', 'First Name')).toBeUndefined();
      expect(validateName('Mary Jane', 'First Name')).toBeUndefined();
    });
  });

  describe('validateMemberId', () => {
    it('should return undefined for valid member IDs', () => {
      expect(validateMemberId('ABC123')).toBeUndefined();
      expect(validateMemberId('MEMBER-123')).toBeUndefined();
      expect(validateMemberId('USER_456')).toBeUndefined();
      expect(validateMemberId('12345ABC')).toBeUndefined();
    });

    it('should return error for empty member ID', () => {
      expect(validateMemberId('')).toBe('Member ID is required');
      expect(validateMemberId('   ')).toBe('Member ID is required');
    });

    it('should return error for member ID too short', () => {
      expect(validateMemberId('AB')).toBe('Member ID must be at least 3 characters long');
    });

    it('should return error for member ID too long', () => {
      const longId = 'A'.repeat(21);
      expect(validateMemberId(longId)).toBe('Member ID must not exceed 20 characters');
    });

    it('should return error for invalid characters', () => {
      expect(validateMemberId('ABC@123')).toBe('Member ID can only contain letters, numbers, hyphens, and underscores');
      expect(validateMemberId('ABC.123')).toBe('Member ID can only contain letters, numbers, hyphens, and underscores');
      expect(validateMemberId('ABC 123')).toBe('Member ID can only contain letters, numbers, hyphens, and underscores');
    });

    it('should return error when no digits present', () => {
      expect(validateMemberId('ABCDEF')).toBe('Member ID must contain at least one number');
      expect(validateMemberId('USER-')).toBe('Member ID must contain at least one number');
    });

    it('should handle member ID with spaces correctly', () => {
      expect(validateMemberId('  ABC123  ')).toBeUndefined();
    });
  });

  describe('validateDate', () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    it('should return undefined for valid dates', () => {
      expect(validateDate(today, 'Birth Date')).toBeUndefined();
      expect(validateDate(new Date('2023-01-01'), 'Birth Date')).toBeUndefined();
    });

    it('should return error for undefined date', () => {
      expect(validateDate(undefined, 'Birth Date')).toBe('Birth Date is required');
    });

    it('should return error for invalid date', () => {
      const invalidDate = new Date('invalid');
      expect(validateDate(invalidDate, 'Birth Date')).toBe('Birth Date is not a valid date');
    });

    it('should return error when date is before minDate', () => {
      expect(validateDate(yesterday, 'Effective Date', today)).toBe(`Effective Date cannot be before ${today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}`);
    });

    it('should return error when date is after maxDate', () => {
      expect(validateDate(tomorrow, 'Birth Date', undefined, today)).toBe(`Birth Date cannot be after ${today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}`);
    });

    it('should return undefined when date is within range', () => {
      expect(validateDate(today, 'Effective Date', yesterday, tomorrow)).toBeUndefined();
    });
  });

  describe('validateDateLogic', () => {
    const createFormData = (dates: Partial<FormData>): FormData => ({
      firstName: 'John',
      lastName: 'Doe',
      memberId: 'ABC123',
      benefitClass: 'A',
      paymentType: 'monthly',
      planNumber: '1',
      paymentTypeDesc: 'Monthly Payment',
      ...dates,
    } as FormData);

    it('should return undefined for valid date sequence', () => {
      const formData = createFormData({
        dateOfBirth: new Date('1990-01-01'),
        dateJoinedFund: new Date('2010-01-01'),
        effectiveDate: new Date('2020-01-01'),
        calculationDate: new Date('2023-01-01'),
      });
      expect(validateDateLogic(formData)).toBeUndefined();
    });

    it('should return undefined when dates are missing', () => {
      const formData = createFormData({
        dateOfBirth: new Date('1990-01-01'),
        // Missing other dates
      });
      expect(validateDateLogic(formData)).toBeUndefined();
    });

    it('should return error when dateJoinedFund is before or equal to dateOfBirth', () => {
      const formData = createFormData({
        dateOfBirth: new Date('1990-01-01'),
        dateJoinedFund: new Date('1990-01-01'), // Same date
        effectiveDate: new Date('2020-01-01'),
        calculationDate: new Date('2023-01-01'),
      });
      expect(validateDateLogic(formData)).toBe('Date Joined Fund must be after Date of Birth');

      const formData2 = createFormData({
        dateOfBirth: new Date('1990-01-01'),
        dateJoinedFund: new Date('1989-12-31'), // Before birth
        effectiveDate: new Date('2020-01-01'),
        calculationDate: new Date('2023-01-01'),
      });
      expect(validateDateLogic(formData2)).toBe('Date Joined Fund must be after Date of Birth');
    });

    it('should return error when effectiveDate is before dateJoinedFund', () => {
      const formData = createFormData({
        dateOfBirth: new Date('1990-01-01'),
        dateJoinedFund: new Date('2010-01-01'),
        effectiveDate: new Date('2009-12-31'), // Before joined fund
        calculationDate: new Date('2023-01-01'),
      });
      expect(validateDateLogic(formData)).toBe('Effective Date cannot be before Date Joined Fund');
    });

    it('should return error when calculationDate is before effectiveDate', () => {
      const formData = createFormData({
        dateOfBirth: new Date('1990-01-01'),
        dateJoinedFund: new Date('2010-01-01'),
        effectiveDate: new Date('2020-01-01'),
        calculationDate: new Date('2019-12-31'), // Before effective date
      });
      expect(validateDateLogic(formData)).toBe('Calculation Date cannot be before Effective Date');
    });

    it('should allow same dates for effective and calculation dates', () => {
      const formData = createFormData({
        dateOfBirth: new Date('1990-01-01'),
        dateJoinedFund: new Date('2010-01-01'),
        effectiveDate: new Date('2020-01-01'),
        calculationDate: new Date('2020-01-01'), // Same as effective date
      });
      expect(validateDateLogic(formData)).toBeUndefined();
    });
  });
});
