"use client"
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { AlertManager, ErrorAlert } from '@/src/utils/alertUtils';
import { X } from 'lucide-react';

interface AlertContextType {
  showAlert: (alert: ErrorAlert) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [currentAlert, setCurrentAlert] = useState<ErrorAlert | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set up the AlertManager callback
    AlertManager.setAlertCallback((alert: ErrorAlert) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      setCurrentAlert(alert);
      
      // Auto-hide info alerts after 5 seconds
      if (alert.type === 'info') {
        timeoutRef.current = setTimeout(() => {
          setCurrentAlert(null);
          timeoutRef.current = null;
        }, 5000);
      }
    });

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      AlertManager.setAlertCallback(() => {});
    };
  }, []);

  const showAlert = (alert: ErrorAlert) => {
    setCurrentAlert(alert);
  };

  const hideAlert = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setCurrentAlert(null);
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      
      {/* Global Alert Display */}
      {currentAlert && (
        <div className="fixed top-4 right-4 z-50 w-96 max-w-sm">
          <div 
            className={`
              relative w-full rounded-lg border shadow-lg p-4 text-sm
              ${currentAlert.type === 'error' 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : currentAlert.type === 'warning'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
              }
            `}
            role="alert"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                {currentAlert.title && (
                  <div className="font-medium mb-1 pr-2">
                    {currentAlert.title}
                  </div>
                )}
                <div className="text-sm leading-relaxed break-words">
                  {currentAlert.message}
                </div>
              </div>
              <button
                onClick={hideAlert}
                className={`
                  flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors
                  ${currentAlert.type === 'error' 
                    ? 'text-red-600 hover:text-red-700' 
                    : currentAlert.type === 'warning'
                    ? 'text-yellow-600 hover:text-yellow-700'
                    : 'text-blue-600 hover:text-blue-700'
                  }
                `}
                aria-label="Close alert"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};