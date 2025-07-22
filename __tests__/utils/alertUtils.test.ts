import {
  AlertManager,
  ErrorAlert,
  getErrorMessage,
  getNetworkErrorMessage,
  getApiErrorMessage,
} from '@/src/utils/alertUtils';

describe('alertUtils', () => {
  describe('AlertManager', () => {
    let mockCallback: jest.Mock;

    beforeEach(() => {
      mockCallback = jest.fn();
      AlertManager.setAlertCallback(mockCallback);
    });

    afterEach(() => {
      jest.clearAllMocks();
      // Reset callback to null
      AlertManager.setAlertCallback(null as any);
    });

    describe('showError', () => {
      it('should call callback with error alert when callback is set', () => {
        AlertManager.showError('Test error message', 'Test Title');

        expect(mockCallback).toHaveBeenCalledWith({
          type: 'error',
          message: 'Test error message',
          title: 'Test Title',
        });
      });

      it('should use default title when not provided', () => {
        AlertManager.showError('Test error message');

        expect(mockCallback).toHaveBeenCalledWith({
          type: 'error',
          message: 'Test error message',
          title: 'Error',
        });
      });

      it('should fallback to console.error when no callback is set', () => {
        AlertManager.setAlertCallback(null as any);
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        AlertManager.showError('Test error message', 'Test Title');

        expect(consoleSpy).toHaveBeenCalledWith('Test Title: Test error message');
        expect(mockCallback).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
      });
    });

    describe('showWarning', () => {
      it('should call callback with warning alert when callback is set', () => {
        AlertManager.showWarning('Test warning message', 'Test Title');

        expect(mockCallback).toHaveBeenCalledWith({
          type: 'warning',
          message: 'Test warning message',
          title: 'Test Title',
        });
      });

      it('should use default title when not provided', () => {
        AlertManager.showWarning('Test warning message');

        expect(mockCallback).toHaveBeenCalledWith({
          type: 'warning',
          message: 'Test warning message',
          title: 'Warning',
        });
      });

      it('should fallback to console.warn when no callback is set', () => {
        AlertManager.setAlertCallback(null as any);
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

        AlertManager.showWarning('Test warning message', 'Test Title');

        expect(consoleSpy).toHaveBeenCalledWith('Test Title: Test warning message');
        expect(mockCallback).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
      });
    });

    describe('showInfo', () => {
      it('should call callback with info alert when callback is set', () => {
        AlertManager.showInfo('Test info message', 'Test Title');

        expect(mockCallback).toHaveBeenCalledWith({
          type: 'info',
          message: 'Test info message',
          title: 'Test Title',
        });
      });

      it('should use default title when not provided', () => {
        AlertManager.showInfo('Test info message');

        expect(mockCallback).toHaveBeenCalledWith({
          type: 'info',
          message: 'Test info message',
          title: 'Information',
        });
      });

      it('should fallback to console.info when no callback is set', () => {
        AlertManager.setAlertCallback(null as any);
        const consoleSpy = jest.spyOn(console, 'info').mockImplementation();

        AlertManager.showInfo('Test info message', 'Test Title');

        expect(consoleSpy).toHaveBeenCalledWith('Test Title: Test info message');
        expect(mockCallback).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
      });
    });
  });

  describe('getErrorMessage', () => {
    it('should return message from Error instance', () => {
      const error = new Error('Test error message');
      expect(getErrorMessage(error)).toBe('Test error message');
    });

    it('should return string error as is', () => {
      expect(getErrorMessage('String error message')).toBe('String error message');
    });

    it('should extract message from object with message property', () => {
      const errorObj = { message: 'Object error message' };
      expect(getErrorMessage(errorObj)).toBe('Object error message');
    });

    it('should return default message for unknown error types', () => {
      expect(getErrorMessage(123)).toBe('An unexpected error occurred');
      expect(getErrorMessage(null)).toBe('An unexpected error occurred');
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
      expect(getErrorMessage({})).toBe('An unexpected error occurred');
    });

    it('should handle object with non-string message property', () => {
      const errorObj = { message: 123 };
      expect(getErrorMessage(errorObj)).toBe('123');
    });
  });

  describe('getNetworkErrorMessage', () => {
    it('should return network error message', () => {
      expect(getNetworkErrorMessage()).toBe('Network error. Please check your internet connection and try again.');
    });
  });

  describe('getApiErrorMessage', () => {
    it('should return specific error messages for known status codes', () => {
      expect(getApiErrorMessage(400)).toBe('Invalid request. Please check your input and try again.');
      expect(getApiErrorMessage(401)).toBe('Authentication required. Please log in again.');
      expect(getApiErrorMessage(403)).toBe('You do not have permission to perform this action.');
      expect(getApiErrorMessage(404)).toBe('The requested resource was not found.');
      expect(getApiErrorMessage(408)).toBe('Request timeout. Please try again.');
      expect(getApiErrorMessage(409)).toBe('Conflict occurred. The resource may have been modified by another user.');
      expect(getApiErrorMessage(422)).toBe('Invalid data provided. Please check your input.');
      expect(getApiErrorMessage(429)).toBe('Too many requests. Please wait a moment before trying again.');
      expect(getApiErrorMessage(500)).toBe('Internal server error. Please try again later.');
      expect(getApiErrorMessage(502)).toBe('Service temporarily unavailable. Please try again later.');
      expect(getApiErrorMessage(503)).toBe('Service temporarily unavailable. Please try again later.');
      expect(getApiErrorMessage(504)).toBe('Request timeout. Please try again later.');
    });

    it('should return default message with status code for unknown status codes', () => {
      expect(getApiErrorMessage(418)).toBe('An error occurred (418). Please try again.');
      expect(getApiErrorMessage(999)).toBe('An error occurred (999). Please try again.');
    });

    it('should use provided default message when available', () => {
      expect(getApiErrorMessage(418, 'Custom error message')).toBe('Custom error message');
      expect(getApiErrorMessage(400, 'Custom bad request message')).toBe('Custom bad request message');
    });

    it('should prefer default message over built-in message', () => {
      expect(getApiErrorMessage(404, 'Resource not available')).toBe('Resource not available');
    });
  });
});
