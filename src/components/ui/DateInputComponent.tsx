import React, { useState, useEffect } from 'react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/src/lib/utils";
import { Calendar } from "@/src/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";

interface DateInputComponentProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  disabled?: boolean;
  showCalendarButton?: boolean;
}

const DateInputComponent: React.FC<DateInputComponentProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = "dd/mm/yyyy",
  className,
  hasError,
  disabled,
  showCalendarButton = true
}) => {
  // Local state to manage the input display value
  const [inputValue, setInputValue] = useState("");
  // Track if user is actively editing
  const [isEditing, setIsEditing] = useState(false);

  // Update local input value 
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value ? format(value, "dd/MM/yyyy") : "");
    }
  }, [value, isEditing]);

  const formatDateInput = (input: string): string => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, '');
    
    // Format as dd/mm/yyyy
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
  };

  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    
    // Remove any non-digit characters and parse as ddmmyyyy
    const digits = dateString.replace(/\D/g, '');
    
    if (digits.length === 8) {
      const day = parseInt(digits.slice(0, 2), 10);
      const month = parseInt(digits.slice(2, 4), 10);
      const year = parseInt(digits.slice(4, 8), 10);
      
      // Basic validation
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
        const date = new Date(year, month - 1, day);
        // Check if the date is valid (handles leap years, etc.)
        if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
          return date;
        }
      }
    }
    
    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatDateInput(rawValue);
    
    // Mark as editing when user starts typing
    setIsEditing(true);
    
    // Update local state
    setInputValue(formattedValue);
    
    // Parse and notify parent component
    const parsedDate = parseDate(formattedValue);
    onChange(parsedDate);
  };

  const handleInputBlur = () => {
    // Stop editing mode on blur
    setIsEditing(false);
    
    // On blur, if the input is incomplete or invalid, you might want to revert to the original value
    const parsedDate = parseDate(inputValue);
    if (!parsedDate && inputValue.length > 0) {
      // If there's partial input that doesn't form a valid date, keep it for user to continue editing
      // Only clear if it's completely invalid format
      const digits = inputValue.replace(/\D/g, '');
      if (digits.length < 8) {
        // Allow partial dates to remain for continued editing
      }
    }
    
    if (onBlur) {
      onBlur();
    }
  };

  const handleInputFocus = () => {
    // Mark as editing when user focuses on the input
    setIsEditing(true);
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        className={cn(
          "max-w-xs",
          hasError && "border-red-500",
          className
        )}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        disabled={disabled}
        maxLength={10}
      />
      {showCalendarButton && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "p-2",
                hasError && "border-red-500"
              )}
              tabIndex={-1}
              type="button"
              disabled={disabled}
            >
              <CalendarIcon   className="h-4 w-4 " />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value}
              defaultSelected={value}
              onSelect={(date) => onChange(date)}
              showOutsideDays={true}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DateInputComponent;