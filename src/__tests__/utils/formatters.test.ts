import {
  formatCurrency,
  formatDate,
  formatPercent,
  formatMemberId,
  formatPhoneNumber,
  parseFormattedNumber,
} from '@/utils/formatters';
import { DATE_FORMATS } from '@/constants';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers as currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should format negative numbers as currency', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('should handle string inputs', () => {
      expect(formatCurrency('1234.56')).toBe('$1,234.56');
      expect(formatCurrency('invalid')).toBe('$0.00');
    });

    it('should handle null and undefined', () => {
      expect(formatCurrency(null)).toBe('$0.00');
      expect(formatCurrency(undefined)).toBe('$0.00');
    });

    it('should handle custom currency symbol', () => {
      expect(formatCurrency(1234.56, '€')).toBe('€1,234.56');
      expect(formatCurrency(1234.56, '£')).toBe('£1,234.56');
    });
  });

  describe('formatDate', () => {
    const testDate = new Date('2024-01-15T10:30:00Z');

    it('should format date with default format', () => {
      expect(formatDate(testDate)).toBe('15/01/2024');
    });

    it('should format date with custom format', () => {
      expect(formatDate(testDate, DATE_FORMATS.API)).toBe('2024-01-15');
      expect(formatDate(testDate, DATE_FORMATS.LONG)).toBe('January 15, 2024');
    });

    it('should handle string date inputs', () => {
      expect(formatDate('2024-01-15')).toBe('15/01/2024');
    });

    it('should handle invalid dates', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
      expect(formatDate(new Date('invalid'))).toBe('');
      expect(formatDate('invalid')).toBe('');
    });

    it('should handle different date formats', () => {
      expect(formatDate(testDate, 'yyyy-MM-dd')).toBe('2024-01-15');
      expect(formatDate(testDate, 'dd-MM-yyyy')).toBe('15-01-2024');
      expect(formatDate(testDate, 'MM/dd/yyyy')).toBe('01/15/2024');
    });
  });

  describe('formatPercent', () => {
    it('should format decimal as percentage', () => {
      expect(formatPercent(0.1234)).toBe('12.34%');
      expect(formatPercent(0.5)).toBe('50.00%');
      expect(formatPercent(1.0)).toBe('100.00%');
    });

    it('should format with custom decimal places', () => {
      expect(formatPercent(0.1234, 1)).toBe('12.3%');
      expect(formatPercent(0.1234, 3)).toBe('12.340%');
      expect(formatPercent(0.1234, 0)).toBe('12%');
    });

    it('should handle string inputs', () => {
      expect(formatPercent('0.1234')).toBe('12.34%');
      expect(formatPercent('invalid')).toBe('0.00%');
    });

    it('should handle null and undefined', () => {
      expect(formatPercent(null)).toBe('0.00%');
      expect(formatPercent(undefined)).toBe('0.00%');
    });

    it('should handle negative percentages', () => {
      expect(formatPercent(-0.1234)).toBe('-12.34%');
    });
  });

  describe('formatMemberId', () => {
    it('should format member ID with proper casing and spacing', () => {
      expect(formatMemberId('abc123def')).toBe('ABC123DEF');
      expect(formatMemberId('ABC123')).toBe('ABC123');
    });

    it('should handle mixed case inputs', () => {
      expect(formatMemberId('aBc123DeF')).toBe('ABC123DEF');
    });

    it('should handle empty and invalid inputs', () => {
      expect(formatMemberId('')).toBe('');
      expect(formatMemberId(null)).toBe('');
      expect(formatMemberId(undefined)).toBe('');
    });

    it('should preserve numbers and letters only', () => {
      expect(formatMemberId('abc-123-def')).toBe('ABC-123-DEF');
      expect(formatMemberId('abc@123#def')).toBe('ABC@123#DEF');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format US phone numbers', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
      expect(formatPhoneNumber('12345678901')).toBe('+1 (234) 567-8901');
    });

    it('should handle phone numbers with existing formatting', () => {
      expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890');
      expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
    });

    it('should handle international numbers', () => {
      expect(formatPhoneNumber('+1234567890')).toBe('(123) 456-7890');
    });

    it('should handle invalid inputs', () => {
      expect(formatPhoneNumber('')).toBe('');
      expect(formatPhoneNumber('123')).toBe('123');
      expect(formatPhoneNumber('invalid')).toBe('invalid');
      expect(formatPhoneNumber(null)).toBe('');
      expect(formatPhoneNumber(undefined)).toBe('');
    });
  });

  describe('parseFormattedNumber', () => {
    it('should parse formatted currency', () => {
      expect(parseFormattedNumber('$1,234.56')).toBe(1234.56);
      expect(parseFormattedNumber('€1,234.56')).toBe(1234.56);
      expect(parseFormattedNumber('-$1,234.56')).toBe(-1234.56);
    });

    it('should parse formatted percentages', () => {
      expect(parseFormattedNumber('12.34%')).toBe(12.34);
      expect(parseFormattedNumber('-5.67%')).toBe(-5.67);
    });

    it('should parse plain numbers', () => {
      expect(parseFormattedNumber('1234.56')).toBe(1234.56);
      expect(parseFormattedNumber('1,234.56')).toBe(1234.56);
      expect(parseFormattedNumber('-1234.56')).toBe(-1234.56);
    });

    it('should handle invalid inputs', () => {
      expect(parseFormattedNumber('invalid')).toBe(0);
      expect(parseFormattedNumber('')).toBe(0);
      expect(parseFormattedNumber(null)).toBe(0);
      expect(parseFormattedNumber(undefined)).toBe(0);
    });

    it('should handle mixed formatting', () => {
      expect(parseFormattedNumber('$1,234.56 USD')).toBe(1234.56);
      expect(parseFormattedNumber('1,234.56 (estimated)')).toBe(1234.56);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      const largeNumber = 999999999999.99;
      expect(formatCurrency(largeNumber)).toBe('$999,999,999,999.99');
      expect(parseFormattedNumber(formatCurrency(largeNumber))).toBe(largeNumber);
    });

    it('should handle very small numbers', () => {
      const smallNumber = 0.01;
      expect(formatCurrency(smallNumber)).toBe('$0.01');
      expect(formatPercent(smallNumber)).toBe('1.00%');
    });

    it('should handle zero values consistently', () => {
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatPercent(0)).toBe('0.00%');
      expect(parseFormattedNumber('$0.00')).toBe(0);
    });

    it('should handle date edge cases', () => {
      const futureDate = new Date('2099-12-31');
      const pastDate = new Date('1900-01-01');
      
      expect(formatDate(futureDate)).toBe('31/12/2099');
      expect(formatDate(pastDate)).toBe('01/01/1900');
    });
  });
});