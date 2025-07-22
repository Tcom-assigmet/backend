import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3001';

// Global test utilities
global.TestUtils = {
  // Helper to wait for async operations
  waitFor: (fn, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        try {
          const result = fn();
          if (result) {
            resolve(result);
          } else if (Date.now() - startTime > timeout) {
            reject(new Error('Timeout waiting for condition'));
          } else {
            setTimeout(check, 10);
          }
        } catch (error) {
          if (Date.now() - startTime > timeout) {
            reject(error);
          } else {
            setTimeout(check, 10);
          }
        }
      };
      check();
    });
  },
};

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
        args[0].includes('componentWillUpdate'))
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Custom matchers
expect.extend({
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received.getTime());
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid date`
          : `expected ${received} to be a valid date`,
      pass,
    };
  },
  
  toHaveErrorMessage(received, expected) {
    const errorElement = received.querySelector('[data-testid="error-message"]');
    const pass = errorElement && errorElement.textContent === expected;
    return {
      message: () =>
        pass
          ? `expected element not to have error message "${expected}"`
          : `expected element to have error message "${expected}", but got "${errorElement?.textContent || 'no error message'}"`,
      pass,
    };
  },
});

// Polyfills for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock fetch for API tests
global.fetch = jest.fn();

// Setup zustand mock
jest.mock('zustand');

// Create a proper mock for file reading
global.FileReader = class FileReader {
  constructor() {
    this.readyState = 0;
    this.result = null;
    this.error = null;
    this.onload = null;
    this.onerror = null;
    this.onprogress = null;
  }
  
  readAsText(file) {
    setTimeout(() => {
      this.readyState = 2;
      this.result = 'mocked file content';
      if (this.onload) this.onload({ target: this });
    }, 0);
  }
  
  readAsDataURL(file) {
    setTimeout(() => {
      this.readyState = 2;
      this.result = 'data:text/plain;base64,bW9ja2VkIGZpbGUgY29udGVudA==';
      if (this.onload) this.onload({ target: this });
    }, 0);
  }
};