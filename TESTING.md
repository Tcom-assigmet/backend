# Testing Documentation

This project includes comprehensive unit tests for all API service classes and utility functions.

## Test Setup

### Testing Framework
- **Jest**: Primary testing framework
- **ts-jest**: TypeScript support for Jest
- **@testing-library/jest-dom**: Additional Jest matchers for DOM testing

### Test Structure
```
__tests__/
├── utils/
│   ├── formatters.test.ts
│   ├── validations.test.ts
│   ├── alertUtils.test.ts
│   ├── FormDataProcessor.test.ts
│   ├── baseAPIService.test.ts
│   └── utils.test.ts
└── services/
    ├── calculation-service.test.ts
    └── benefit-calculator-service.test.ts
```

## Running Tests

### Available Scripts
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The test suite provides comprehensive coverage for:

### Utility Functions (98.29% coverage)
- **formatters.ts**: Date formatting, currency formatting, age calculations
- **validations.ts**: Form validation functions for names, member IDs, dates
- **alertUtils.ts**: Alert management and error message utilities
- **FormDataProcessor.ts**: Form data processing and type conversion
- **baseAPIService.ts**: Base API service class with error handling
- **utils.ts**: Utility functions like className merging

### API Service Classes (100% coverage)
- **BenefitCalculatorStartService**: Benefit calculation initiation
- **BenefitCalculatorCompleteService**: Benefit calculation completion

## Test Features

### Comprehensive Test Cases
- ✅ Happy path scenarios
- ✅ Error handling and edge cases
- ✅ Input validation testing
- ✅ Network error simulation
- ✅ Type conversion testing
- ✅ Date and number formatting
- ✅ API response handling

### Mocking Strategy
- Mock fetch for HTTP requests
- Mock AlertManager for error handling
- Mock console methods to avoid noise
- Isolated unit testing with dependency injection

### Test Quality
- 139 total tests
- 8 test suites
- Covers both positive and negative test cases
- Tests error boundaries and edge cases
- Validates type safety and data conversion

## Key Test Examples

### Formatters Testing
```typescript
describe('formatCurrency', () => {
  it('should format number values to currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(-1234.56)).toBe('$-1,234.56');
  });
});
```

### API Service Testing
```typescript
describe('submitCalculation', () => {
  it('should handle API error responses', async () => {
    const errorResponse: ApiError = {
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
    };
    mockMakeRequest.mockResolvedValueOnce(errorResponse);

    await expect(service.submitCalculation(mockFormData))
      .rejects.toThrow('Validation failed');
  });
});
```

### Validation Testing
```typescript
describe('validateMemberId', () => {
  it('should return error when no digits present', () => {
    expect(validateMemberId('ABCDEF'))
      .toBe('Member ID must contain at least one number');
  });
});
```

## Configuration

### Jest Configuration (`jest.config.js`)
- TypeScript support with ts-jest
- Path mapping for `@/` imports
- Coverage collection from source files
- Custom test environment setup

### Setup File (`jest.setup.js`)
- Global fetch mocking
- Console method mocking
- Test cleanup between runs

## Best Practices Implemented

1. **Isolation**: Each test is independent and doesn't affect others
2. **Mocking**: External dependencies are properly mocked
3. **Coverage**: High test coverage with meaningful assertions
4. **Error Cases**: Comprehensive error scenario testing
5. **Type Safety**: TypeScript integration for type checking
6. **Documentation**: Clear test descriptions and organized structure

This testing setup ensures reliable, maintainable code with confidence in functionality across all utility functions and API service classes.
