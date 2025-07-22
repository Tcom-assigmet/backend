// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type NonNullable<T> = T extends null | undefined ? never : T;

// Common data types
export type DataType = 'Double' | 'String' | 'Boolean' | 'Date';
export type FormValue = string | number | boolean | Date | null;
export type ProcessedFormData = Record<string, FormValue>;

// API Response types
export interface BaseApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
  readonly timestamp?: string;
}

export interface ApiError {
  readonly error: string;
  readonly code?: string;
  readonly details?: Record<string, unknown>;
}

// Form related types
export type FormErrors = Record<string, string>;
export type ValidationResult = string | null;

// Component props types
export interface BaseComponentProps {
  className?: string;
  id?: string;
  testId?: string;
}

export interface LoadingState {
  loading: boolean;
  error?: string | null;
}

// Status types
export type ProcessStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

// File types
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// Pagination types
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: ProcessStatus;
  [key: string]: any;
}

// Sort types
export type SortDirection = 'asc' | 'desc';
export interface SortState {
  field: string;
  direction: SortDirection;
}

// Generic table types
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T) => React.ReactNode;
}

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Generic callback types
export type Callback = () => void;
export type AsyncCallback = () => Promise<void>;
export type ValueCallback<T> = (value: T) => void;
export type AsyncValueCallback<T> = (value: T) => Promise<void>;

// Date range type
export interface DateRange {
  start: Date;
  end: Date;
}

// Generic key-value types
export type KeyValuePair<T = string> = {
  key: string;
  value: T;
  label?: string;
};

// Generic option types for dropdowns/selects
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
}

// Navigation types
export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

// Theme types (re-exported from theme module)
export type { ThemeColors, ThemeSpacing, ThemeBorderRadius, ThemeFontSize } from '@/theme';

// Type guards
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isNumber = (value: unknown): value is number => typeof value === 'number' && !isNaN(value);
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
export const isDate = (value: unknown): value is Date => value instanceof Date && !isNaN(value.getTime());
export const isArray = <T>(value: unknown): value is T[] => Array.isArray(value);
export const isObject = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isApiError = (response: unknown): response is ApiError => {
  return isObject(response) && 'error' in response && isString(response.error);
};

export const isApiResponse = <T>(response: unknown): response is BaseApiResponse<T> => {
  return isObject(response) && 'success' in response && isBoolean(response.success);
};

// Utility types for form validation
export interface ValidationRule<T = any> {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => ValidationResult;
}

export interface FieldValidation {
  id: string;
  rules: ValidationRule;
  message?: string;
}

// Generic state management types
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

export interface CacheState<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Environment and configuration types
export type Environment = 'development' | 'testing' | 'staging' | 'production';

export interface AppConfig {
  apiBaseUrl: string;
  environment: Environment;
  version: string;
  features: Record<string, boolean>;
}

// Audit and tracking types
export interface AuditInfo {
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}

// Export commonly used external types
export type { ReactNode, ReactElement, FC } from 'react';