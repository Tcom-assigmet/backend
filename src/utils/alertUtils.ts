export interface ErrorAlert {
  title?: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

export class AlertManager {
  private static alertCallback: ((alert: ErrorAlert) => void) | null = null;

  static setAlertCallback(callback: (alert: ErrorAlert) => void) {
    AlertManager.alertCallback = callback;
  }

  static showError(message: string, title?: string) {
    if (AlertManager.alertCallback) {
      AlertManager.alertCallback({
        type: 'error',
        message,
        title: title || 'Error'
      });
    } else {
      // Fallback to console error if no callback is set
      console.error(`${title || 'Error'}: ${message}`);
    }
  }

  static showWarning(message: string, title?: string) {
    if (AlertManager.alertCallback) {
      AlertManager.alertCallback({
        type: 'warning',
        message,
        title: title || 'Warning'
      });
    } else {
      console.warn(`${title || 'Warning'}: ${message}`);
    }
  }

  static showInfo(message: string, title?: string) {
    if (AlertManager.alertCallback) {
      AlertManager.alertCallback({
        type: 'info',
        message,
        title: title || 'Information'
      });
    } else {
      console.info(`${title || 'Information'}: ${message}`);
    }
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unexpected error occurred';
};

export const getNetworkErrorMessage = (): string => {
  return 'Network error. Please check your internet connection and try again.';
};

export const getApiErrorMessage = (status: number, defaultMessage?: string): string => {
  const errorMessages: Record<number, string> = {
    400: 'Invalid request. Please check your input and try again.',
    401: 'Authentication required. Please log in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    408: 'Request timeout. Please try again.',
    409: 'Conflict occurred. The resource may have been modified by another user.',
    422: 'Invalid data provided. Please check your input.',
    429: 'Too many requests. Please wait a moment before trying again.',
    500: 'Internal server error. Please try again later.',
    502: 'Service temporarily unavailable. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
    504: 'Request timeout. Please try again later.',
  };

  return defaultMessage || errorMessages[status] || `An error occurred (${status}). Please try again.`;
};