import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { v4 as uuidv4 } from 'uuid';

// Types for logging
export interface LogContext {
  correlationId: string;
  sessionId: string;
  userId?: string;
  userRole?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface UserJourneyEvent {
  eventType: 'page_view' | 'user_action' | 'form_submit' | 'api_call' | 'error' | 'performance' | 'business_event';
  eventName: string;
  correlationId: string;
  timestamp: string;
  duration?: number;
  success?: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface LoggerConfig {
  instrumentationKey?: string;
  enableConsoleLogging?: boolean;
  enableRemoteLogging?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  customProperties?: Record<string, any>;
}

class CustomLogger {
  private appInsights: ApplicationInsights | null = null;
  private config: LoggerConfig;
  private sessionId: string;
  private correlationId: string;
  private userId?: string;
  private userRole?: string;
  private isInitialized = false;

  constructor(config: LoggerConfig = {}) {
    this.config = {
      enableConsoleLogging: true,
      enableRemoteLogging: true,
      logLevel: 'info',
      ...config
    };
    
    this.sessionId = this.generateSessionId();
    this.correlationId = this.generateCorrelationId();
    
    // Only initialize Application Insights in browser
    if (typeof window !== 'undefined') {
      this.initializeApplicationInsights();
    }
  }

  private initializeApplicationInsights(): void {
    // Only initialize in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      if (this.config.instrumentationKey && this.config.enableRemoteLogging) {
        this.appInsights = new ApplicationInsights({
          config: {
            instrumentationKey: this.config.instrumentationKey,
            enableRequestHeaderTracking: true,
            enableResponseHeaderTracking: true,
            enableCorsCorrelation: true,
            enableAutoRouteTracking: true,
            enableUnhandledPromiseRejectionTracking: true,
            autoTrackPageVisitTime: true,
            correlationHeaderExcludedDomains: ['*.blob.core.windows.net'],
            disableAjaxTracking: false,
            maxBatchInterval: 0,
            maxBatchSizeInBytes: 64000,
          }
        });

        this.appInsights.loadAppInsights();
        
        // Set initial context
        this.appInsights.setAuthenticatedUserContext(this.sessionId);
        this.appInsights.addTelemetryInitializer((envelope) => {
          if (envelope.baseData) {
            envelope.baseData.properties = {
              ...envelope.baseData.properties,
              sessionId: this.sessionId,
              correlationId: this.correlationId,
              userId: this.userId,
              userRole: this.userRole,
              ...this.config.customProperties
            };
          }
          return true;
        });

        this.isInitialized = true;
        this.logInfo('Logger initialized with Azure Application Insights', {
          sessionId: this.sessionId,
          correlationId: this.correlationId
        });
      } else {
        this.logConsole('warn', 'Azure Application Insights not configured - using console logging only');
      }
    } catch (error) {
      this.logConsole('error', 'Failed to initialize Azure Application Insights', { error });
    }
  }

  private generateCorrelationId(): string {
    return `corr_${uuidv4()}`;
  }

  private generateSessionId(): string {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return `sess_${uuidv4()}_ssr`;
    }
    
    const existing = sessionStorage.getItem('logger_session_id');
    if (existing) return existing;
    
    const newSessionId = `sess_${uuidv4()}`;
    sessionStorage.setItem('logger_session_id', newSessionId);
    return newSessionId;
  }

  private logConsole(level: string, message: string, data?: any): void {
    if (!this.config.enableConsoleLogging) return;

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level: level.toUpperCase(),
      message,
      correlationId: this.correlationId,
      sessionId: this.sessionId,
      userId: this.userId,
      userRole: this.userRole,
      ...data
    };

    switch (level) {
      case 'debug':
        console.debug(`[${timestamp}] [DEBUG] ${message}`, logData);
        break;
      case 'info':
        console.info(`[${timestamp}] [INFO] ${message}`, logData);
        break;
      case 'warn':
        console.warn(`[${timestamp}] [WARN] ${message}`, logData);
        break;
      case 'error':
        console.error(`[${timestamp}] [ERROR] ${message}`, logData);
        break;
      default:
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, logData);
    }
  }

  // Set user context
  setUserContext(userId: string, userRole?: string, additionalProperties?: Record<string, any>): void {
    this.userId = userId;
    this.userRole = userRole;
    
    if (this.appInsights) {
      this.appInsights.setAuthenticatedUserContext(userId);
      if (additionalProperties) {
        Object.assign(this.config.customProperties || {}, additionalProperties);
      }
    }

    this.logInfo('User context updated', { userId, userRole, additionalProperties });
  }

  // Generate new correlation ID for new user journey
  startNewJourney(): string {
    this.correlationId = this.generateCorrelationId();
    this.logInfo('New user journey started', { correlationId: this.correlationId });
    return this.correlationId;
  }

  // Get current correlation ID
  getCorrelationId(): string {
    return this.correlationId;
  }

  // Get current session ID
  getSessionId(): string {
    return this.sessionId;
  }

  // Track user journey events
  trackUserJourney(eventType: UserJourneyEvent['eventType'], eventName: string, metadata?: Record<string, any>): void {
    const event: UserJourneyEvent = {
      eventType,
      eventName,
      correlationId: this.correlationId,
      timestamp: new Date().toISOString(),
      metadata: {
        sessionId: this.sessionId,
        userId: this.userId,
        userRole: this.userRole,
        ...metadata
      }
    };

    this.logInfo(`User Journey: ${eventType} - ${eventName}`, event);

    if (this.appInsights) {
      this.appInsights.trackEvent({
        name: `UserJourney_${eventType}`,
        properties: {
          eventName,
          correlationId: this.correlationId,
          eventType,
          ...event.metadata
        }
      });
    }
  }

  // Track page views
  trackPageView(pageName: string, url?: string, metadata?: Record<string, any>): void {
    const properties = {
      correlationId: this.correlationId,
      sessionId: this.sessionId,
      userId: this.userId,
      userRole: this.userRole,
      ...metadata
    };

    this.logInfo(`Page View: ${pageName}`, { url, ...properties });

    if (this.appInsights) {
      this.appInsights.trackPageView({
        name: pageName,
        uri: url || window.location.href,
        properties
      });
    }

    this.trackUserJourney('page_view', pageName, { url, ...metadata });
  }

  // Track user actions
  trackUserAction(action: string, component?: string, metadata?: Record<string, any>): void {
    const properties = {
      component,
      correlationId: this.correlationId,
      sessionId: this.sessionId,
      userId: this.userId,
      userRole: this.userRole,
      ...metadata
    };

    this.logInfo(`User Action: ${action}`, properties);

    if (this.appInsights) {
      this.appInsights.trackEvent({
        name: 'UserAction',
        properties: {
          action,
          component,
          ...properties
        }
      });
    }

    this.trackUserJourney('user_action', action, { component, ...metadata });
  }

  // Standard logging methods
  logInfo(message: string, data?: any): void {
    if (['debug', 'info'].includes(this.config.logLevel || 'info')) {
      this.logConsole('info', message, data);
    }
  }

  logWarn(message: string, data?: any): void {
    if (['debug', 'info', 'warn'].includes(this.config.logLevel || 'info')) {
      this.logConsole('warn', message, data);
      
      if (this.appInsights) {
        this.appInsights.trackTrace({
          message: `WARNING: ${message}`,
          severityLevel: 2,
          properties: {
            correlationId: this.correlationId,
            sessionId: this.sessionId,
            userId: this.userId,
            userRole: this.userRole,
            ...data
          }
        });
      }
    }
  }

  logError(message: string, error?: Error, data?: any): void {
    this.logConsole('error', message, { error: error?.message, stack: error?.stack, ...data });
    
    if (this.appInsights) {
      this.appInsights.trackException({
        exception: error || new Error(message),
        properties: {
          correlationId: this.correlationId,
          sessionId: this.sessionId,
          userId: this.userId,
          userRole: this.userRole,
          customMessage: message,
          ...data
        }
      });
    }

    this.trackUserJourney('error', message, { error: error?.message, stack: error?.stack, ...data });
  }

  // Flush logs to Application Insights
  flush(): void {
    if (this.appInsights) {
      this.appInsights.flush();
    }
  }
}

// Export singleton instance
const logger = new CustomLogger();

export default logger;
