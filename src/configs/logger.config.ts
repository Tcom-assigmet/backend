export const loggerConfig = {
  // Azure Application Insights configuration
  instrumentationKey: process.env.NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATIONKEY || '',
  
  // Logging configuration
  enableConsoleLogging: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOGGING === 'true',
  enableRemoteLogging: process.env.NEXT_PUBLIC_ENABLE_REMOTE_LOGGING !== 'false',
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
  
  // Custom properties that will be added to all telemetry
  customProperties: {
    environment: process.env.NODE_ENV || 'development',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'local',
    region: process.env.NEXT_PUBLIC_REGION || 'local'
  },

  // Performance tracking thresholds
  performanceThresholds: {
    pageLoadWarning: 3000, // 3 seconds
    pageLoadError: 10000,  // 10 seconds
    apiCallWarning: 2000,  // 2 seconds
    apiCallError: 5000,    // 5 seconds
    formSubmitWarning: 1000, // 1 second
    formSubmitError: 3000    // 3 seconds
  },

  // Error tracking configuration
  errorTracking: {
    trackUnhandledPromiseRejections: true,
    trackUnhandledExceptions: true,
    trackConsoleErrors: process.env.NODE_ENV === 'development'
  },

  // User journey tracking configuration
  userJourneyTracking: {
    trackPageViews: true,
    trackUserActions: true,
    trackFormInteractions: true,
    trackBusinessEvents: true,
    trackPerformanceMetrics: true
  }
};

export type LoggerConfig = typeof loggerConfig;
