# Error Handling Implementation

This document explains the comprehensive error handling system implemented for API requests in the application.

## Overview

The error handling system provides automatic error alerts for all API requests made through service classes, ensuring users receive proper feedback when errors occur.

## Components

### 1. AlertUtils (`src/utils/alertUtils.ts`)

A utility module that provides:
- **AlertManager**: Centralized alert management system
- **Error message utilities**: Standardized error message generation
- **Type definitions**: TypeScript interfaces for error alerts

### 2. AlertProvider (`src/components/ui/AlertProvider.tsx`)

A React context provider that:
- Manages global alert state
- Displays alerts in a fixed position (top-right corner)
- Provides auto-dismiss functionality for info alerts
- **Fixed layout issues**: Simplified alert styling for proper text alignment
- **Improved close functionality**: Proper timeout management for auto-dismiss

### 3. ErrorBoundary (`src/components/ui/ErrorBoundary.tsx`)

A React error boundary component that:
- Catches JavaScript errors anywhere in the component tree
- Displays a full-screen "Something went wrong" message
- Provides a "Try Again" button to recover from errors
- Shows detailed error information in development mode

### 4. Enhanced BaseApiService (`src/utils/baseAPIService.ts`)

Updated base service class that:
- Automatically shows error alerts for API failures
- Provides configurable alert behavior
- Handles different types of errors (network, API, authentication)
- Uses standardized error messages

## Features

### Automatic Error Alerts

All API requests made through service classes automatically show appropriate error messages:

```typescript
// Example service usage - errors are handled automatically
const service = new BenefitCalculatorStartService();
try {
  const result = await service.startProcess(data);
  // Handle success
} catch (error) {
  // Error alert is automatically shown
  // Handle additional error logic if needed
}
```

### Error Types and Messages

The system provides specific error messages for different scenarios:

- **400**: "Invalid request. Please check your input and try again."
- **401**: "Authentication required. Please log in again."
- **403**: "You do not have permission to perform this action."
- **404**: "The requested resource was not found."
- **500**: "Internal server error. Please try again later."
- **Network errors**: "Network error. Please check your internet connection and try again."

### Alert Display

**Side Alerts** appear in the top-right corner with:
- **Fixed styling**: Proper text alignment and readable layout
- **Color-coded backgrounds**: Red for errors, yellow for warnings, blue for info
- **Reliable close button**: Manual dismissal with proper timeout cleanup
- **Auto-dismiss**: Info alerts automatically close after 5 seconds
- **Proper accessibility**: ARIA attributes and keyboard navigation

**Main Window Error** displays a full-screen page with:
- "Something went wrong" message
- "Try Again" button to recover from errors
- Clean, centered layout with clear instructions
- Development mode shows error details for debugging

## Implementation Details

### Service Classes

All service classes extend `BaseApiService` and inherit automatic error handling:

```typescript
export class BenefitCalculatorStartService extends BaseApiService {
  constructor() {
    super(API_ENDPOINTS.START_BENEFIT_CALCULATOR);
    // showAlerts defaults to true
  }
}
```

### Form Integration

Forms maintain their existing error handling for local validation while benefiting from automatic API error alerts:

```typescript
try {
  const response = await service.submitData(formData);
  // Handle success
} catch (error) {
  // Global alert is shown automatically
  // Set local form error state if needed
  setFormError(error.message);
}
```

### Manual Alert Usage

You can also manually trigger alerts using the AlertManager:

```typescript
import { AlertManager } from '@/src/utils/alertUtils';

// Show different types of alerts
AlertManager.showError('Something went wrong', 'Error Title');
AlertManager.showWarning('Please be careful', 'Warning');
AlertManager.showInfo('Process completed successfully');
```

## Configuration

### Disabling Alerts for Specific Services

If you need to disable automatic alerts for a specific service:

```typescript
export class SilentService extends BaseApiService {
  constructor() {
    super(API_ENDPOINTS.SOME_ENDPOINT, false); // showAlerts = false
  }
}
```

### Customizing Error Messages

The system uses the server response message when available, falling back to standardized messages. You can customize these in `alertUtils.ts`.

## Files Modified

1. **Created**:
   - `src/utils/alertUtils.ts` - Alert management utilities
   - `src/components/ui/AlertProvider.tsx` - Global alert provider with fixed styling
   - `src/components/ui/ErrorBoundary.tsx` - Error boundary for application errors
   - `src/components/demo/ErrorTestDemo.tsx` - Demo component for testing error handling

2. **Modified**:
   - `src/utils/baseAPIService.ts` - Added automatic error handling
   - `src/app/Mainlayout.tsx` - Added AlertProvider and ErrorBoundary wrappers
   - `src/components/forms/benefitCalculatorStartForm/BenefitCalculatorStartForm.tsx` - Updated error handling
   - `src/components/forms/enterCalculationDetailsForm/EnterCalculationDetailsForm.tsx` - Updated error handling
   - `src/components/forms/BulkProcessBenefitCalForm.tsx` - Added comprehensive error handling

## Benefits

1. **Consistent UX**: All API errors are displayed consistently across the application
2. **Better User Feedback**: Users get immediate, clear feedback when errors occur
3. **Reduced Code Duplication**: Error handling logic is centralized
4. **Maintainable**: Easy to update error messages and behavior globally
5. **Accessible**: Proper ARIA attributes and keyboard navigation support

## Usage Examples

### Basic Service Call
```typescript
// Error handling is automatic
const result = await benefitCalculatorService.startProcess(data);
```

### With Additional Form Error Handling
```typescript
try {
  const result = await service.submitCalculation(data);
  // Success handling
} catch (error) {
  // Global alert shown automatically
  // Additional form-specific error handling
  setSubmitError(error.message);
}
```

### Bulk Operations with Custom Alerts
```typescript
try {
  const response = await fetch('/api/upload', options);
  if (!response.ok) {
    const errorMessage = getApiErrorMessage(response.status, 'Upload failed');
    AlertManager.showError(errorMessage, 'Upload Failed');
  }
} catch (error) {
  AlertManager.showError(getNetworkErrorMessage(), 'Upload Error');
}
```

## Testing the Implementation

To test the error handling system, you can use the demo component:

```typescript
import { ErrorTestDemo } from '@/src/components/demo/ErrorTestDemo';

// Add this component to any page to test the error handling
<ErrorTestDemo />
```

The demo provides buttons to test:
- API error alerts (side popup)
- Network error alerts (side popup)
- Warning alerts (side popup)
- Info alerts (side popup with auto-dismiss)
- Application errors (full-screen error page)

## Fixes Applied

### Issue 1: Alert Text Alignment
- **Problem**: Alert text was "chunked to left corner" and not clear
- **Solution**: Replaced complex grid-based Alert component with simplified custom styling
- **Result**: Text is now properly aligned, readable, and clearly formatted

### Issue 2: Alert Not Closing
- **Problem**: Close button was not working properly
- **Solution**: Improved timeout management with proper cleanup using useRef
- **Result**: Close button now works reliably, and timeouts are properly managed

This implementation ensures that users always receive appropriate feedback when API requests fail, improving the overall user experience and making error handling consistent across the application.