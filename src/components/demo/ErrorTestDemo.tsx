"use client"
import React from 'react';
import { AlertManager } from '@/src/utils/alertUtils';

export const ErrorTestDemo: React.FC = () => {
  const triggerApiError = () => {
    AlertManager.showError(
      'This is a test API error message. The request failed due to invalid parameters.',
      'API Request Failed'
    );
  };

  const triggerNetworkError = () => {
    AlertManager.showError(
      'Network connection failed. Please check your internet connection and try again.',
      'Network Error'
    );
  };

  const triggerWarning = () => {
    AlertManager.showWarning(
      'This is a warning message. Please review your input before proceeding.',
      'Warning'
    );
  };

  const triggerInfo = () => {
    AlertManager.showInfo(
      'This is an informational message. The operation completed successfully.',
      'Information'
    );
  };

  const triggerApplicationError = () => {
    // This will trigger the ErrorBoundary
    throw new Error('This is a test application error that will show the main error screen');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Error Handling Demo</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Side Alert Popup Tests</h2>
          <p className="text-gray-600 mb-4">
            These buttons will trigger different types of alerts that appear in the top-right corner:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={triggerApiError}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Test API Error Alert
            </button>
            
            <button
              onClick={triggerNetworkError}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Test Network Error Alert
            </button>
            
            <button
              onClick={triggerWarning}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Test Warning Alert
            </button>
            
            <button
              onClick={triggerInfo}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Test Info Alert (Auto-dismiss)
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Main Window Error Test</h2>
          <p className="text-gray-600 mb-4">
            This button will trigger an application error that shows the full-screen error page:
          </p>
          
          <button
            onClick={triggerApplicationError}
            className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
          >
            Trigger Application Error
          </button>
          
          <p className="text-sm text-gray-500 mt-2">
            Note: This will show a "Something went wrong" screen with a "Try Again" button.
          </p>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Alert Features</h2>
          <ul className="text-gray-600 space-y-2">
            <li>• Error and warning alerts stay visible until manually closed</li>
            <li>• Info alerts auto-dismiss after 5 seconds</li>
            <li>• All alerts have a close button (X) in the top-right corner</li>
            <li>• Alerts are properly styled with color-coded backgrounds</li>
            <li>• Text is properly aligned and readable</li>
            <li>• Alerts appear in the top-right corner of the screen</li>
          </ul>
        </div>
      </div>
    </div>
  );
};