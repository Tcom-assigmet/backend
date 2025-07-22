# Quick Setup Guide for Custom Logger with Azure Application Insights

## ✅ Implementation Complete!

Your custom logger is now fully implemented and integrated into your application. Here's how to get it running:

## 1. Configure Azure Application Insights

### Get Your Instrumentation Key
1. Go to [Azure Portal](https://portal.azure.com)
2. Create or navigate to your Application Insights resource
3. Go to Overview → Copy the "Instrumentation Key"

### Set Environment Variables
Create a `.env.local` file in your project root:

```bash
# Required: Azure Application Insights Instrumentation Key
NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATIONKEY=your-instrumentation-key-here

# Optional: Logging configuration (defaults shown)
NEXT_PUBLIC_ENABLE_CONSOLE_LOGGING=true
NEXT_PUBLIC_ENABLE_REMOTE_LOGGING=true
NEXT_PUBLIC_LOG_LEVEL=info

# Optional: Application metadata
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_BUILD_ID=local
NEXT_PUBLIC_REGION=local
```

## 2. Start Your Application

```bash
npm run dev
```

## 3. Test the Logger

The logger is now active! Here's what's being tracked:

### ✅ Already Implemented Tracking:
- **Home Page**: Button clicks with correlation IDs
- **Benefit Calculator Form**: Form submissions, validation errors, API calls
- **Page Views**: Automatic page view tracking
- **User Actions**: Click events and navigation
- **Business Events**: Important business logic events
- **Error Tracking**: Comprehensive error logging

### Example Logs You'll See:

#### In Browser Console:
```
[2024-01-15T10:30:00.000Z] [INFO] User Journey: user_action - benefit_calculator_clicked
{
  "correlationId": "corr_123e4567-e89b-12d3-a456-426614174000",
  "sessionId": "sess_987fcdeb-51f2-41a8-b7a9-123456789abc",
  "component": "HomePage",
  "cardType": "individual_calculator",
  "destination": "/benefitCalculate"
}
```

#### In Azure Application Insights:
- Custom events with correlation IDs
- Form submission telemetry
- Error tracking with stack traces
- Performance metrics
- User journey analytics

## 4. View Data in Azure

### Custom Events Query (KQL):
```kusto
customEvents
| where timestamp > ago(1h)
| project timestamp, name, customDimensions.correlationId, customDimensions.sessionId
| order by timestamp desc
```

### User Journey Analysis:
```kusto
customEvents
| where customDimensions.correlationId == "your-correlation-id"
| order by timestamp asc
| project timestamp, name, customDimensions
```

## 5. What's Being Tracked Now

### Current Integrations:
- ✅ **Main Dashboard** (`src/app/page.tsx`)
  - Button clicks with context
  - Business event tracking
  
- ✅ **Benefit Calculator Form** (`src/components/forms/benefitCalculatorStartForm/BenefitCalculatorStartForm.tsx`)
  - Form start/end tracking
  - Validation error logging
  - Successful submission tracking
  - API call monitoring

### Logger Features Active:
- ✅ **Correlation ID tracking** for user journeys
- ✅ **Session management** with browser storage
- ✅ **Azure Application Insights integration**
- ✅ **Error tracking** with stack traces
- ✅ **Performance monitoring**
- ✅ **Business event logging**
- ✅ **Form interaction tracking**

## 6. Add Logging to Other Components

Use the hooks in any component:

```typescript
import { useLogger } from '@/src/hooks/useLogger';

export function MyComponent() {
  const { trackAction, trackBusinessEvent } = useLogger({
    componentName: 'MyComponent',
    trackPageView: true
  });

  const handleClick = () => {
    trackAction('button_clicked', { buttonType: 'export' });
    trackBusinessEvent('data_exported');
  };

  return <button onClick={handleClick}>Export Data</button>;
}
```

## 7. Production Considerations

### Security:
- ✅ **No sensitive data** logged (dates anonymized)
- ✅ **Environment variables** for configuration
- ✅ **Client-side only** initialization

### Performance:
- ✅ **Batched telemetry** to Azure
- ✅ **Async logging** doesn't block UI
- ✅ **Minimal bundle impact**

### Monitoring:
- ✅ **Build tested** and working
- ✅ **SSR compatible** (server-side rendering safe)
- ✅ **Error handling** built-in

## 🎉 You're All Set!

Your logger is now ready to track user journeys with correlation IDs and send telemetry to Azure Application Insights. Just add your instrumentation key and start collecting data!

For detailed usage examples and advanced features, see `LOGGER_IMPLEMENTATION.md`.
