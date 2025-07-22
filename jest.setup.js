// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Mock fetch globally
global.fetch = jest.fn();

// Setup for each test
beforeEach(() => {
  jest.clearAllMocks();
});
