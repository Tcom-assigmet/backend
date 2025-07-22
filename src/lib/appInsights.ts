// lib/appInsights.js
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { v4 as uuidv4 } from 'uuid';

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env.NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATIONKEY,
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
  }
});

let isInitialized = false;

export function initializeAppInsights() {
  if (!isInitialized) {
    appInsights.loadAppInsights();

    appInsights.addTelemetryInitializer((envelope) => {
      envelope.data = envelope.data || {};
      envelope.data.correlationId = getCorrelationId();
    });

    isInitialized = true;
  }
}

export default appInsights;


let correlationId: string | null = null;
 function getCorrelationId() {
  if (!correlationId) {
    correlationId = uuidv4(); // Session-level ID
  }
  return correlationId;
}