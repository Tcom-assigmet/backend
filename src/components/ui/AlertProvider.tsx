"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AlertManager, ErrorAlert } from '@/src/utils/alertUtils';
import { Alert, AlertDescription, AlertTitle } from './alert';
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

  useEffect(() => {
    // Set up the AlertManager callback
    AlertManager.setAlertCallback((alert: ErrorAlert) => {
      setCurrentAlert(alert);
      
      // Auto-hide info alerts after 5 seconds
      if (alert.type === 'info') {
        setTimeout(() => {
          setCurrentAlert(null);
        }, 5000);
      }
    });

    // Cleanup function
    return () => {
      AlertManager.setAlertCallback(() => {});
    };
  }, []);

  const showAlert = (alert: ErrorAlert) => {
    setCurrentAlert(alert);
  };

  const hideAlert = () => {
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
          <Alert variant={getAlertVariant(currentAlert.type)} className="shadow-lg border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {currentAlert.title && (
                  <AlertTitle className="mb-1">
                    {currentAlert.title}
                  </AlertTitle>
                )}
                <AlertDescription>
                  {currentAlert.message}
                </AlertDescription>
              </div>
              <button
                onClick={hideAlert}
                className="ml-2 hover:bg-gray-100 rounded p-1 transition-colors"
                aria-label="Close alert"
              >
                <X size={16} />
              </button>
            </div>
          </Alert>
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