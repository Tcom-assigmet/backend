import { format, isValid, parseISO } from 'date-fns';

import { DATE_FORMATS } from '@/constants';

/**
 * Formats a number as currency
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  currencySymbol = '$'
): string => {
  const numValue = parseFloat(String(value || 0));
  
  if (isNaN(numValue)) {
    return `${currencySymbol}0.00`;
  }

  const formatted = Math.abs(numValue).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return numValue < 0 ? `-${currencySymbol}${formatted}` : `${currencySymbol}${formatted}`;
};

/**
 * Formats a date using date-fns
 */
export const formatDate = (
  date: Date | string | null | undefined,
  formatString: string = DATE_FORMATS.DISPLAY
): string => {
  if (!date) {
    return '';
  }

  let dateObj: Date;
  
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }

  if (!isValid(dateObj)) {
    return '';
  }

  try {
    return format(dateObj, formatString);
  } catch (error) {
    return '';
  }
};

/**
 * Formats a decimal as a percentage
 */
export const formatPercent = (
  value: number | string | null | undefined,
  decimalPlaces = 2
): string => {
  const numValue = parseFloat(String(value || 0));
  
  if (isNaN(numValue)) {
    return '0.00%';
  }

  const percentage = numValue * 100;
  return `${percentage.toFixed(decimalPlaces)}%`;
};

/**
 * Formats a member ID with consistent casing
 */
export const formatMemberId = (
  memberId: string | null | undefined
): string => {
  if (!memberId) {
    return '';
  }

  return memberId.toUpperCase().trim();
};

/**
 * Formats a phone number in US format
 */
export const formatPhoneNumber = (
  phoneNumber: string | null | undefined
): string => {
  if (!phoneNumber) {
    return '';
  }

  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  // Handle different phone number lengths
  if (digits.length === 10) {
    // (123) 456-7890
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11) {
    // +1 (234) 567-8901
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  } else if (digits.length > 11) {
    // International format
    return `+${digits.slice(0, digits.length - 10)} (${digits.slice(-10, -7)}) ${digits.slice(-7, -4)}-${digits.slice(-4)}`;
  } else {
    // Return original if not a standard format
    return phoneNumber;
  }
};

/**
 * Parses a formatted number string back to a number
 */
export const parseFormattedNumber = (
  formattedValue: string | null | undefined
): number => {
  if (!formattedValue) {
    return 0;
  }

  // Remove currency symbols, commas, percentages, and other formatting
  const cleanedValue = formattedValue
    .replace(/[$€£¥₹,\s%]/g, '') // Remove common currency symbols and formatting
    .replace(/[^\d.-]/g, '') // Keep only digits, decimal points, and minus signs
    .trim();

  const numValue = parseFloat(cleanedValue);
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Formats a file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formats a duration in milliseconds to human readable format
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Truncates text to a specified length with ellipsis
 */
export const truncateText = (
  text: string,
  maxLength: number,
  suffix = '...'
): string => {
  if (!text || text.length <= maxLength) {
    return text || '';
  }

  return text.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Formats a name with proper capitalization
 */
export const formatName = (name: string | null | undefined): string => {
  if (!name) {
    return '';
  }

  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats an address for display
 */
export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}): string => {
  const parts = [];

  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zipCode) parts.push(address.zipCode);
  if (address.country && address.country !== 'US') parts.push(address.country);

  return parts.join(', ');
};

/**
 * Formats a social security number with proper masking
 */
export const formatSSN = (
  ssn: string | null | undefined,
  mask = true
): string => {
  if (!ssn) {
    return '';
  }

  const digits = ssn.replace(/\D/g, '');
  
  if (digits.length !== 9) {
    return ssn; // Return original if not valid format
  }

  if (mask) {
    return `XXX-XX-${digits.slice(-4)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  }
};

/**
 * Formats a credit card number with spaces
 */
export const formatCreditCard = (
  cardNumber: string | null | undefined,
  mask = true
): string => {
  if (!cardNumber) {
    return '';
  }

  const digits = cardNumber.replace(/\D/g, '');
  
  if (mask && digits.length >= 4) {
    const lastFour = digits.slice(-4);
    const maskedDigits = '*'.repeat(Math.max(0, digits.length - 4));
    return (maskedDigits + lastFour).replace(/(.{4})/g, '$1 ').trim();
  }

  return digits.replace(/(.{4})/g, '$1 ').trim();
};
