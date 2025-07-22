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
  const [isVisible, setIsVisible] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const AUTO_CLOSE_DURATION = 5000; // 5 seconds

  useEffect(() => {
    // Set up the AlertManager callback
    AlertManager.setAlertCallback((alert: ErrorAlert) => {
      showAlert(alert);
    });

    // Cleanup function
    return () => {
      clearAllTimeouts();
      AlertManager.setAlertCallback(() => {});
    };
  }, []);

  const clearAllTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (progressTimeoutRef.current) {
      clearTimeout(progressTimeoutRef.current);
      progressTimeoutRef.current = null;
    }
  };

  const showAlert = (alert: ErrorAlert) => {
    // Clear any existing timeouts
    clearAllTimeouts();
    
    setCurrentAlert(alert);
    setIsVisible(true);
    
    // Start progress bar animation after a brief delay
    progressTimeoutRef.current = setTimeout(() => {
      setShowProgressBar(true);
    }, 100);
    
    // Auto-hide after duration
    timeoutRef.current = setTimeout(() => {
      hideAlert();
    }, AUTO_CLOSE_DURATION);
  };

  const hideAlert = () => {
    clearAllTimeouts();
    setIsVisible(false);
    setShowProgressBar(false);
    
    // Remove alert after fade out animation
    setTimeout(() => {
      setCurrentAlert(null);
    }, 300);
  };

  const handleManualClose = () => {
    hideAlert();
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      
      {/* Global Alert Display */}
      {currentAlert && (
        <div className={`fixed top-4 right-4 z-50 w-96 max-w-sm transition-all duration-300 ease-in-out ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        }`}>
          <div 
            className={`
              relative w-full rounded-lg border shadow-lg p-4 text-sm overflow-hidden
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
                onClick={handleManualClose}
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
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
              <div 
                className={`
                  h-full transition-all ease-linear
                  ${currentAlert.type === 'error' 
                    ? 'bg-red-400' 
                    : currentAlert.type === 'warning'
                    ? 'bg-yellow-400'
                    : 'bg-blue-400'
                  }
                  ${showProgressBar 
                    ? `w-0 duration-[${AUTO_CLOSE_DURATION}ms]` 
                    : 'w-full duration-0'
                  }
                `}
                style={{
                  transitionDuration: showProgressBar ? `${AUTO_CLOSE_DURATION}ms` : '0ms'
                }}
              />
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