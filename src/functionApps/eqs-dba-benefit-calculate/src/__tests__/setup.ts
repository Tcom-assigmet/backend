// Global test setup
global.console = {
  ...console,
  // Mock console methods to reduce noise in tests
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.CAMUNDA_BASE_URL = 'http://localhost:8080';
process.env.CAMUNDA_USERNAME = 'test';
process.env.CAMUNDA_PASSWORD = 'test';

// Set test timeout
jest.setTimeout(10000);