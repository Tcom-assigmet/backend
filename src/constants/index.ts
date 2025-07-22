// Application constants
export const APP_NAME = 'EQS25002' as const;
export const APP_VERSION = '0.1.0' as const;

// API Constants
export const API_ENDPOINTS = {
  BENEFIT_CALCULATOR: '/api/benefit-calculator',
  BULK_PROCESS: '/api/bulk-process',
  MEMBER_DATA: '/api/member-data',
} as const;

// Form validation constants
export const VALIDATION_RULES = {
  MIN_AGE: 18,
  MAX_AGE: 100,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MEMBER_ID_PATTERN: /^[A-Z0-9]{6,12}$/,
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  LONG: 'MMMM d, yyyy',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  PAGINATION_SIZE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['.csv', '.xlsx', '.xls'] as const,
} as const;

// Status constants
export const PROCESS_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export type ProcessStatus = typeof PROCESS_STATUS[keyof typeof PROCESS_STATUS];

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_AGE: 'Age must be between 18 and 100 years',
  INVALID_MEMBER_ID: 'Member ID must be 6-12 characters (letters and numbers only)',
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  INVALID_FILE_TYPE: 'Please select a valid file type (.csv, .xlsx, .xls)',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;

export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];