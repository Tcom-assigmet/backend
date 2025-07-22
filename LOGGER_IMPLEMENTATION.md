# Custom Logger with Azure Application Insights Integration

This implementation provides a comprehensive logging system that tracks user journey with correlation IDs and integrates with Azure Application Insights.

## Features

### ✅ Core Functionality
- **Correlation ID Tracking**: Unique correlation IDs for each user session and journey
- **Azure Application Insights Integration**: Automatic telemetry sending to Azure
- **User Journey Tracking**: Page views, user actions, form submissions, API calls
- **Error Tracking**: Comprehensive error logging with stack traces
- **Performance Monitoring**: Track performance metrics and bottlenecks
- **Business Event Logging**: Track important business events

### ✅ React Integration
- **React Hooks**: Easy-to-use hooks for component integration
- **Form Logging**: Specialized form tracking with validation errors
- **Context Provider**: Application-wide logger configuration
- **Component Lifecycle Tracking**: Mount/unmount tracking

## Files Created

### Core Logger System
- `src/utils/logger.ts` - Main logger utility with Azure Application Insights integration
- `src/hooks/useLogger.ts` - React hooks for easy component integration
- `src/providers/LoggerProvider.tsx` - React context provider for logger configuration
- `src/configs/logger.config.ts` - Configuration file with environment variables

### Environment Configuration
- `.env.local.example` - Template for environment variables

## Usage Examples

### 1. Basic Component Tracking

```typescript
import { useLogger } from '@/src/hooks/useLogger';

export function MyComponent() {
  const { trackAction, trackBusinessEvent } = useLogger({
    componentName: 'MyComponent',
    trackPageView: true,
    trackComponentMount: true
  });

  const handleButtonClick = () => {
    trackAction('button_clicked', {
      buttonType: 'primary',
      context: 'user_dashboard'
    });
    
    trackBusinessEvent('user_initiated_calculation');
  };

  return (
    <button onClick={handleButtonClick}>
      Calculate Benefits
    </button>
  );
}
```

### 2. Form Tracking

```typescript
import { useFormLogger } from '@/src/hooks/useLogger';

export function MyForm() {
  const { trackFormSubmission, trackFormError } = useFormLogger({
    formName: 'BenefitCalculationForm',
    trackValidationErrors: true
  });

  const handleSubmit = async (formData) => {
    try {
      const result = await submitForm(formData);
      trackFormSubmission(true, [], { resultId: result.id });
    } catch (error) {
      trackFormError(error, { formData: sanitizedFormData });
      trackFormSubmission(false, [error.message]);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 3. Direct Logger Usage

```typescript
import logger from '@/src/utils/logger';

// Set user context (typically done after login)
logger.setUserContext('user123', 'admin', {
  department: 'finance',
  region: 'north'
});

// Start a new user journey
const correlationId = logger.startNewJourney();

// Track various events
logger.trackPageView('Dashboard', '/dashboard');
logger.trackUserAction('export_data', 'ReportsComponent');
logger.trackBusinessEvent('monthly_report_generated');
logger.logError('API call failed', error, { endpoint: '/api/reports' });
```

## Configuration

### Environment Variables

```bash
# Required: Azure Application Insights Instrumentation Key
NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATIONKEY=your-key-here

# Optional: Logging configuration
NEXT_PUBLIC_ENABLE_CONSOLE_LOGGING=true
NEXT_PUBLIC_ENABLE_REMOTE_LOGGING=true
NEXT_PUBLIC_LOG_LEVEL=info

# Optional: Application metadata
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_BUILD_ID=abc123
NEXT_PUBLIC_REGION=us-east-1
```

### Setup in Layout

The logger is automatically configured in your app layout:

```typescript
// src/app/layout.tsx
import { LoggerProvider } from '@/src/providers/LoggerProvider';
import { loggerConfig } from '@/src/configs/logger.config';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LoggerProvider
          instrumentationKey={loggerConfig.instrumentationKey}
          enableConsoleLogging={loggerConfig.enableConsoleLogging}
          enableRemoteLogging={loggerConfig.enableRemoteLogging}
          logLevel={loggerConfig.logLevel}
          customProperties={loggerConfig.customProperties}
        >
          {children}
        </LoggerProvider>
      </body>
    </html>
  );
}
```

## Data Structure

### Correlation ID Format
- Session ID: `sess_[uuid]` - Persists for the browser session
- Correlation ID: `corr_[uuid]` - Changes with each new user journey

### Logged Data Examples

#### User Action Event
```json
{
  "eventType": "user_action",
  "eventName": "benefit_calculator_clicked",
  "correlationId": "corr_123e4567-e89b-12d3-a456-426614174000",
  "sessionId": "sess_987fcdeb-51f2-41a8-b7a9-123456789abc",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userId": "user123",
  "userRole": "admin",
  "component": "HomePage",
  "metadata": {
    "cardType": "individual_calculator",
    "destination": "/benefitCalculate"
  }
}
```

#### Form Submission Event
```json
{
  "eventType": "form_submit",
  "eventName": "BenefitCalculatorStartForm",
  "correlationId": "corr_123e4567-e89b-12d3-a456-426614174000",
  "success": true,
  "metadata": {
    "processInstanceId": "proc_456",
    "benefitClass": "active",
    "paymentType": "lump_sum",
    "memberAge": 65,
    "formDuration": 45000
  }
}
```

## Azure Application Insights Integration

### What Gets Tracked

1. **Custom Events**: User actions, form submissions, business events
2. **Page Views**: Automatic page view tracking with custom properties
3. **Dependencies**: API calls with timing and success/failure
4. **Exceptions**: All errors with stack traces and context
5. **Metrics**: Performance metrics and custom measurements
6. **Traces**: Debug and informational messages

### Queries in Azure

Example KQL queries to analyze the data:

```kusto
// Find all events for a specific user journey
customEvents
| where customDimensions.correlationId == "corr_123e4567-e89b-12d3-a456-426614174000"
| order by timestamp asc

// Analyze form submission success rates
customEvents
| where name == "FormSubmit"
| summarize 
    Total = count(),
    Successful = countif(customDimensions.success == "true"),
    Failed = countif(customDimensions.success == "false")
by customDimensions.formName

// Track user journey from page view to form completion
customEvents
| where customDimensions.sessionId == "sess_987fcdeb-51f2-41a8-b7a9-123456789abc"
| where name in ("UserJourney_page_view", "UserJourney_form_submit")
| order by timestamp asc
```

## Benefits

1. **Complete User Journey Tracking**: Follow users from entry to completion
2. **Error Correlation**: Link errors to specific user sessions and actions
3. **Performance Monitoring**: Identify slow operations and bottlenecks
4. **Business Intelligence**: Track important business metrics
5. **Debugging**: Rich context for troubleshooting issues
6. **Compliance**: Audit trail for user actions

## Security Considerations

- Personal data is not logged (dates are anonymized in logs)
- User IDs are hashed or anonymized
- Sensitive form data is excluded from logs
- Environment variables protect API keys

## Next Steps

1. Configure your Azure Application Insights instance
2. Set the instrumentation key in environment variables
3. Deploy and start collecting telemetry
4. Create dashboards in Azure Application Insights
5. Set up alerts for critical errors or performance issues

The logger is now fully integrated and ready to track your user journey with correlation IDs!
