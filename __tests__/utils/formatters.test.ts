import {
  formatDate,
  formatCurrency,
  formatFactorValue,
  calculateAge,
  getCurrentDate,
  calculateAgeforInput,
  formatDateForApi,
} from '@/src/utils/formatters';

describe('formatters', () => {
  describe('formatDate', () => {
    it('should format valid date string to en-GB format', () => {
      expect(formatDate('2023-12-25')).toBe('25/12/2023');
      expect(formatDate('2023-01-01')).toBe('01/01/2023');
    });

    it('should return "-" for empty or undefined input', () => {
      expect(formatDate('')).toBe('-');
      expect(formatDate(undefined)).toBe('-');
    });

    it('should return "Invalid Date" for invalid date and log error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      expect(formatDate('invalid-date')).toBe('Invalid Date');
      consoleSpy.mockRestore();
    });

    it('should handle ISO date strings', () => {
      expect(formatDate('2023-12-25T10:30:00Z')).toBe('25/12/2023');
    });
  });

  describe('formatCurrency', () => {
    it('should format number values to currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should format string values to currency', () => {
      expect(formatCurrency('1234.56')).toBe('$1,234.56');
      expect(formatCurrency('1000')).toBe('$1,000.00');
    });

    it('should return $0.00 for zero values', () => {
      expect(formatCurrency('0.0')).toBe('$0.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should return $0.00 for empty or invalid values', () => {
      expect(formatCurrency('')).toBe('$0.00');
      expect(formatCurrency(undefined)).toBe('$0.00');
      expect(formatCurrency('invalid')).toBe('$0.00');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-1234.56)).toBe('$-1,234.56');
    });
  });

  describe('formatFactorValue', () => {
    it('should format salary values as currency', () => {
      expect(formatFactorValue('salary', 50000)).toBe('$50,000.00');
      expect(formatFactorValue('baseSalary', '60000')).toBe('$60,000.00');
      expect(formatFactorValue('SAL_AMOUNT', 70000)).toBe('$70,000.00');
    });

    it('should return string representation for non-salary values', () => {
      expect(formatFactorValue('age', 30)).toBe('30');
      expect(formatFactorValue('experience', '5 years')).toBe('5 years');
      expect(formatFactorValue('department', 'IT')).toBe('IT');
    });

    it('should return "-" for undefined values', () => {
      expect(formatFactorValue('age', undefined)).toBe('-');
      expect(formatFactorValue('salary', undefined)).toBe('$0.00');
    });
  });

  describe('calculateAge', () => {
    it('should calculate age correctly', () => {
      expect(calculateAge('1990-01-01', '2023-01-01')).toBe(33);
      expect(calculateAge('1995-06-15', '2023-06-14')).toBe(27);
      expect(calculateAge('1995-06-15', '2023-06-15')).toBe(28);
      expect(calculateAge('1995-06-15', '2023-06-16')).toBe(28);
    });

    it('should return "-" for missing dates', () => {
      expect(calculateAge(undefined, '2023-01-01')).toBe('-');
      expect(calculateAge('1990-01-01', undefined)).toBe('-');
      expect(calculateAge(undefined, undefined)).toBe('-');
    });

    it('should return NaN for invalid dates', () => {
      // Invalid dates in calculateAge result in NaN from date calculations
      expect(calculateAge('invalid', '2023-01-01')).toBeNaN();
      expect(calculateAge('1990-01-01', 'invalid')).toBeNaN();
    });

    it('should handle leap years correctly', () => {
      expect(calculateAge('2000-02-29', '2023-02-28')).toBe(22);
      expect(calculateAge('2000-02-29', '2023-03-01')).toBe(23);
    });
  });

  describe('getCurrentDate', () => {
    it('should return current date in en-GB format', () => {
      const result = getCurrentDate();
      expect(result).toMatch(/\d{2} \w+ \d{4}/);
      // Check if it's a valid date format
      const today = new Date();
      const expectedFormat = today.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      expect(result).toBe(expectedFormat);
    });
  });

  describe('calculateAgeforInput', () => {
    it('should calculate age between two Date objects', () => {
      const birthDate = new Date('1990-01-01');
      const compareDate = new Date('2023-01-01');
      expect(calculateAgeforInput(birthDate, compareDate)).toBe(33);
    });

    it('should handle birthday not yet reached in compare year', () => {
      const birthDate = new Date('1990-06-15');
      const compareDate = new Date('2023-06-14');
      expect(calculateAgeforInput(birthDate, compareDate)).toBe(32);
    });

    it('should handle birthday already passed in compare year', () => {
      const birthDate = new Date('1990-06-15');
      const compareDate = new Date('2023-06-16');
      expect(calculateAgeforInput(birthDate, compareDate)).toBe(33);
    });

    it('should return 0 for invalid dates', () => {
      const validDate = new Date('2023-01-01');
      // @ts-ignore - Testing invalid input
      expect(calculateAgeforInput(null, validDate)).toBe(0);
      // @ts-ignore - Testing invalid input
      expect(calculateAgeforInput(validDate, null)).toBe(0);
    });

    it('should return 0 for negative age (future birth date)', () => {
      const birthDate = new Date('2025-01-01');
      const compareDate = new Date('2023-01-01');
      expect(calculateAgeforInput(birthDate, compareDate)).toBe(0);
    });

    it('should handle same date (age 0)', () => {
      const date = new Date('2023-01-01');
      expect(calculateAgeforInput(date, date)).toBe(0);
    });
  });

  describe('formatDateForApi', () => {
    it('should format Date object for API with timezone offset', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      const result = formatDateForApi(date);
      expect(result).toBe('2023-12-25T10:30:00.000+0000');
    });

    it('should handle different dates', () => {
      const date = new Date('2023-01-01T00:00:00Z');
      const result = formatDateForApi(date);
      expect(result).toBe('2023-01-01T00:00:00.000+0000');
    });

    it('should format milliseconds correctly', () => {
      const date = new Date('2023-12-25T10:30:15.123Z');
      const result = formatDateForApi(date);
      expect(result).toBe('2023-12-25T10:30:15.123+0000');
    });
  });
});
