import { useEffect, useCallback, useRef } from 'react';
<<<<<<< HEAD
=======
import { useRouter } from 'next/navigation';
>>>>>>> 00660db5e08b8bac68cb9f948f37481370f9917e
import logger from '@/src/utils/logger';

interface UseLoggerOptions {
  componentName?: string;
  trackPageView?: boolean;
  trackComponentMount?: boolean;
  trackComponentUnmount?: boolean;
}

interface UseLoggerReturn {
  trackAction: (action: string, metadata?: Record<string, any>) => void;
  trackFormSubmit: (formName: string, success: boolean, validationErrors?: string[], metadata?: Record<string, any>) => void;
  trackBusinessEvent: (eventName: string, metadata?: Record<string, any>) => void;
  trackError: (message: string, error?: Error, metadata?: Record<string, any>) => void;
  trackPerformance: (metricName: string, value: number, metadata?: Record<string, any>) => void;
  startNewJourney: () => string;
  getCorrelationId: () => string;
  getSessionId: () => string;
  setUserContext: (userId: string, userRole?: string, additionalProperties?: Record<string, any>) => void;
}

export const useLogger = (options: UseLoggerOptions = {}): UseLoggerReturn => {
  const mountTimeRef = useRef<number>(Date.now());
  const {
    componentName,
    trackPageView = false,
    trackComponentMount = false,
    trackComponentUnmount = false
  } = options;

  // Track component lifecycle
  useEffect(() => {
    if (trackComponentMount && componentName) {
      logger.trackUserAction('component_mount', componentName, {
        mountTime: new Date().toISOString()
      });
    }

    // Track page view if enabled
    if (trackPageView) {
      const pageName = componentName || window.location.pathname;
      logger.trackPageView(pageName, window.location.href);
    }

    return () => {
      if (trackComponentUnmount && componentName) {
        const mountDuration = Date.now() - mountTimeRef.current;
        logger.trackUserAction('component_unmount', componentName, {
          unmountTime: new Date().toISOString(),
          mountDuration
        });
      }
    };
  }, [componentName, trackPageView, trackComponentMount, trackComponentUnmount]);

  // Track user actions with component context
  const trackAction = useCallback((action: string, metadata?: Record<string, any>) => {
    logger.trackUserAction(action, componentName, metadata);
  }, [componentName]);

  // Track form submissions with component context
  const trackFormSubmit = useCallback((formName: string, success: boolean, validationErrors?: string[], metadata?: Record<string, any>) => {
    logger.trackFormSubmit(formName, success, validationErrors, {
      component: componentName,
      ...metadata
    });
  }, [componentName]);

  // Track business events with component context
  const trackBusinessEvent = useCallback((eventName: string, metadata?: Record<string, any>) => {
    logger.trackBusinessEvent(eventName, {
      component: componentName,
      ...metadata
    });
  }, [componentName]);

  // Track errors with component context
  const trackError = useCallback((message: string, error?: Error, metadata?: Record<string, any>) => {
    logger.logError(message, error, {
      component: componentName,
      ...metadata
    });
  }, [componentName]);

  // Track performance metrics with component context
  const trackPerformance = useCallback((metricName: string, value: number, metadata?: Record<string, any>) => {
    logger.trackPerformance(metricName, value, {
      component: componentName,
      ...metadata
    });
  }, [componentName]);

  const startNewJourney = useCallback(() => {
    return logger.startNewJourney();
  }, []);

  const getCorrelationId = useCallback(() => {
    return logger.getCorrelationId();
  }, []);

  const getSessionId = useCallback(() => {
    return logger.getSessionId();
  }, []);

  const setUserContext = useCallback((userId: string, userRole?: string, additionalProperties?: Record<string, any>) => {
    logger.setUserContext(userId, userRole, additionalProperties);
  }, []);

  return {
    trackAction,
    trackFormSubmit,
    trackBusinessEvent,
    trackError,
    trackPerformance,
    startNewJourney,
    getCorrelationId,
    getSessionId,
    setUserContext
  };
};

// Hook for form logging
interface UseFormLoggerOptions {
  formName: string;
  trackValidationErrors?: boolean;
  trackFieldChanges?: boolean;
}

export const useFormLogger = (options: UseFormLoggerOptions) => {
  const { formName, trackValidationErrors = true, trackFieldChanges = false } = options;
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    logger.trackUserAction('form_start', 'FormLogger', {
      formName,
      startTime: new Date().toISOString()
    });

    return () => {
      const duration = Date.now() - startTimeRef.current;
      logger.trackUserAction('form_end', 'FormLogger', {
        formName,
        duration,
        endTime: new Date().toISOString()
      });
    };
  }, [formName]);

  const trackFieldChange = useCallback((fieldName: string, oldValue: any, newValue: any) => {
    if (trackFieldChanges) {
      logger.trackUserAction('form_field_change', 'FormLogger', {
        formName,
        fieldName,
        oldValue: typeof oldValue === 'object' ? JSON.stringify(oldValue) : oldValue,
        newValue: typeof newValue === 'object' ? JSON.stringify(newValue) : newValue
      });
    }
  }, [formName, trackFieldChanges]);

  const trackFormSubmission = useCallback((success: boolean, validationErrors?: string[], metadata?: Record<string, any>) => {
    const duration = Date.now() - startTimeRef.current;
    
    logger.trackFormSubmit(formName, success, validationErrors, {
      formDuration: duration,
      ...metadata
    });

    if (!success && trackValidationErrors && validationErrors?.length) {
      logger.logWarn(`Form validation failed: ${formName}`, {
        validationErrors,
        formName
      });
    }
  }, [formName, trackValidationErrors]);

  const trackFormError = useCallback((error: Error, metadata?: Record<string, any>) => {
    logger.logError(`Form error in ${formName}`, error, {
      formName,
      ...metadata
    });
  }, [formName]);

  return {
    trackFieldChange,
    trackFormSubmission,
    trackFormError
  };
};
