'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import logger from '@/src/utils/logger';

interface LoggerContextType {
  isInitialized: boolean;
  correlationId: string;
  sessionId: string;
  setUserContext: (userId: string, userRole?: string, additionalProperties?: Record<string, any>) => void;
  startNewJourney: () => string;
}

const LoggerContext = createContext<LoggerContextType | undefined>(undefined);

interface LoggerProviderProps {
  children: React.ReactNode;
  instrumentationKey?: string;
  enableConsoleLogging?: boolean;
  enableRemoteLogging?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  customProperties?: Record<string, any>;
}

export const LoggerProvider: React.FC<LoggerProviderProps> = ({
  children,
  instrumentationKey,
  enableConsoleLogging = true,
  enableRemoteLogging = true,
  logLevel = 'info',
  customProperties = {}
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [correlationId, setCorrelationId] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    setCorrelationId(logger.getCorrelationId());
    setSessionId(logger.getSessionId());
    setIsInitialized(true);

    // Track provider initialization
    logger.trackUserAction('logger_provider_initialized', 'LoggerProvider', {
      instrumentationKey: instrumentationKey ? 'configured' : 'not_configured',
      enableConsoleLogging,
      enableRemoteLogging,
      logLevel
    });

    // Handle page unload to flush logs
    const handleBeforeUnload = () => {
      logger.flush();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [instrumentationKey, enableConsoleLogging, enableRemoteLogging, logLevel, customProperties]);

  const setUserContext = (userId: string, userRole?: string, additionalProperties?: Record<string, any>) => {
    logger.setUserContext(userId, userRole, additionalProperties);
  };

  const startNewJourney = () => {
    const newCorrelationId = logger.startNewJourney();
    setCorrelationId(newCorrelationId);
    return newCorrelationId;
  };

  const contextValue: LoggerContextType = {
    isInitialized,
    correlationId,
    sessionId,
    setUserContext,
    startNewJourney
  };

  return (
    <LoggerContext.Provider value={contextValue}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLoggerContext = (): LoggerContextType => {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error('useLoggerContext must be used within a LoggerProvider');
  }
  return context;
};
