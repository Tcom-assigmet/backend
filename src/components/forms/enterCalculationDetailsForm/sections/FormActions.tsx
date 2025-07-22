"use client"

import type React from "react"

interface FormActionsProps {
  onBack?: () => void
  onCancel: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  canSubmit: boolean
  isSubmitting: boolean
}

export const FormActions: React.FC<FormActionsProps> = ({ onBack, onCancel, onSubmit, canSubmit, isSubmitting }) => {
  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <div className="mt-8 flex justify-between">
        {/* Left side - Back button */}
        <div className="flex space-x-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
        </div>

        {/* Right side - Cancel and Submit buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 transition-colors flex items-center ${
              canSubmit
                ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  )
}
