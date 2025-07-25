# Testing Documentation

This document describes the comprehensive unit testing setup for the EQS DBA Benefit Calculation Azure Functions project using Jest.

## Test Structure

The tests are organized in the following structure:

```
src/__tests__/
├── setup.ts                 # Global test configuration
├── testUtils.ts             # Test utility functions and mocks
├── integration.test.ts      # Integration tests
├── functions/               # Azure Function tests
│   ├── startBenefitCalculation.test.ts
│   ├── completeTask.test.ts
│   ├── getTaskDetails.test.ts
│   └── getFinalResults.test.ts
├── services/                # Service layer tests
│   └── benefitCalculationService.test.ts
└── utils/                   # Utility tests
    ├── validation.test.ts
    └── helpers.test.ts
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Specific Test Files
```bash
npm test -- --testPathPattern="validation.test.ts"
npm test -- --testPathPattern="functions"
```

## Test Categories

### 1. Validation Tests (`validation.test.ts`)
Tests the input validation service with scenarios including:
- **Valid Request Validation**: Ensures properly formatted requests pass validation
- **Required Field Validation**: Tests for missing firstName, lastName, memberId, etc.
- **Date Format Validation**: Tests for valid and invalid date formats
- **Multiple Error Handling**: Tests accumulation of multiple validation errors
- **Edge Cases**: Whitespace-only fields, empty strings

### 2. Helper Function Tests (`helpers.test.ts`)
Tests utility functions and response builders:
- **Response Creation**: Success, error, and various HTTP status responses
- **Error Handling**: Different error types and status codes
- **Data Serialization**: JSON response formatting
- **HTTP Status Code Enums**: Verification of status code constants

### 3. Service Layer Tests (`benefitCalculationService.test.ts`)
Tests the main business logic service:
- **Process Starting**: Starting benefit calculation processes
- **Task Management**: Getting task details and completing tasks
- **Result Retrieval**: Getting final calculation results
- **Error Propagation**: Handling various error scenarios from dependencies
- **Mocking**: All external dependencies (CamundaService) are properly mocked

### 4. Azure Function Tests
Tests each HTTP-triggered Azure Function:

#### `startBenefitCalculation.test.ts`
- **Successful Execution**: Valid requests processed correctly
- **JSON Parsing Errors**: Malformed request bodies
- **Validation Errors**: Invalid request data handling
- **Service Errors**: External service failures
- **Logging**: Request processing and success/error logging

#### `completeTask.test.ts`
- **Task Completion**: Successfully completing process tasks
- **Variable Handling**: Various data types in task variables
- **Process Instance Validation**: Required parameter checking
- **Error Scenarios**: Task not found, invalid variables

#### `getTaskDetails.test.ts`
- **Task Retrieval**: Getting active task information
- **Parameter Validation**: Process instance ID validation
- **Field Requirements**: Required field information handling
- **Not Found Handling**: No active tasks scenarios

#### `getFinalResults.test.ts`
- **Result Retrieval**: Getting completed process results
- **Process Status**: Completed vs. running process handling
- **Error Handling**: Process not found, not completed scenarios

### 5. Integration Tests (`integration.test.ts`)
Higher-level tests that verify component interactions:
- **End-to-End Validation**: Complete request validation flows
- **Response Building**: Full response creation workflows
- **Mock Utilities**: Test helper functionality

## Test Utilities

### Mock Functions (`testUtils.ts`)
- `createMockHttpRequest()`: Creates properly typed HTTP request mocks
- `createMockInvocationContext()`: Creates Azure Functions context mocks

### Common Test Patterns

#### Mocking External Dependencies
```typescript
jest.mock('../../services/camundaService');
const MockedCamundaService = CamundaService as jest.MockedClass<typeof CamundaService>;
```

#### Testing Azure Functions
```typescript
const mockRequest = createMockHttpRequest({
  url: '/api/benefit/start',
  method: 'POST'
});
const mockContext = createMockInvocationContext();

const result = await startBenefitCalculation(mockRequest, mockContext);
```

#### Testing Validation
```typescript
const validRequest: StartProcessRequest = { /* valid data */ };
const errors = validationService.validateStartProcessRequest(validRequest);
expect(errors).toHaveLength(0);
```

## Coverage Goals

The test suite aims for:
- **Function Coverage**: 90%+ of all functions tested
- **Branch Coverage**: 85%+ of code branches covered
- **Statement Coverage**: 90%+ of statements executed

## Test Data

### Valid Test Request
```typescript
const validRequest: StartProcessRequest = {
  firstName: 'John',
  lastName: 'Doe',
  memberId: 'MEM123',
  dateOfBirth: '1990-01-01',
  dateJoinedFund: '2020-01-01',
  effectiveDate: '2024-01-01',
  calculationDate: '2024-01-01',
  benefitClass: 'Standard',
  paymentType: 'Monthly',
  planNumber: 'PLAN001',
  paymentTypeDesc: 'Monthly Payment'
};
```

## Available Test Scenarios

### Validation Scenarios
✅ Valid request passes validation  
✅ Missing required fields fail validation  
✅ Invalid date formats fail validation  
✅ Whitespace-only fields fail validation  
✅ Multiple validation errors accumulated  

### Function Scenarios
✅ Successful HTTP function execution  
✅ JSON parsing error handling  
✅ Parameter validation  
✅ Service error propagation  
✅ Proper HTTP status code responses  
✅ Logging functionality  

### Service Scenarios
✅ Process starting with valid data  
✅ Task completion with variables  
✅ Task details retrieval  
✅ Final results retrieval  
✅ Error handling from external services  

### Response Building Scenarios
✅ Success responses with data  
✅ Error responses with details  
✅ HTTP status code handling  
✅ Timestamp and request metadata  

## Continuous Integration

Tests are configured to run in CI/CD pipelines with:
- TypeScript compilation
- Lint checking
- Coverage reporting
- Test result artifacts

## Future Enhancements

Potential testing improvements:
- **Performance Tests**: Response time testing
- **Contract Tests**: API contract validation
- **End-to-End Tests**: Full workflow testing with real dependencies
- **Load Tests**: High-volume request testing