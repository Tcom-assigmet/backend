"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Locale } from "date-fns"; 

interface CalendarProps {
  className?: string
  classNames?: {
    months?: string
    month?: string
    caption?: string
    nav?: string
    table?: string
    head_row?: string
    head_cell?: string
    row?: string
    cell?: string
    day?: string
    day_selected?: string
    day_today?: string
    day_outside?: string
    day_disabled?: string
    day_hidden?: string
    day_range_start?: string
    day_range_end?: string
    day_range_middle?: string
    [key: string]: string | undefined
  }
  showOutsideDays?: boolean
  onDateSelect?: (date: Date | undefined) => void
  defaultSelected?: Date
  mode?: "single" | "multiple" | "range"
  selected?: Date | Date[] | { from: Date | undefined; to: Date | undefined }
  onSelect?: (date: Date | undefined) => void
  onMonthChange?: (month: Date) => void
  month?: Date
  disabled?: Date[] | ((date: Date) => boolean)
  fromDate?: Date
  toDate?: Date
  locale?: Locale
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onDateSelect,
  defaultSelected,
  mode = "single",
  selected,
  onSelect,
  onMonthChange,
  month: controlledMonth,
  disabled,
  fromDate,
  toDate,
  locale,
  ...restProps
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    selected instanceof Date ? selected : new Date()
  )
  const [month, setMonth] = React.useState<Date>(controlledMonth || defaultSelected || new Date())
  const [showYearPicker, setShowYearPicker] = React.useState(false)

  const currentYear = month.getFullYear()
  const currentMonth = month.getMonth()

  // Generate year options (from 1900 to current year + 10)
  const currentYearActual = new Date().getFullYear()
  const yearOptions = Array.from(
    { length: currentYearActual - 1900 + 11 }, 
    (_, i) => 1900 + i
  ).reverse()

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    onDateSelect?.(date)
    onSelect?.(date)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(month)
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1)
    } else {
      newDate.setMonth(currentMonth + 1)
    }
    setMonth(newDate)
    onMonthChange?.(newDate)
  }

  const navigateYear = (direction: 'prev' | 'next') => {
    const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1
    const newDate = new Date(newYear, currentMonth, 1)
    setMonth(newDate)
    onMonthChange?.(newDate)
  }

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, currentMonth, 1)
    setMonth(newDate)
    setShowYearPicker(false)
    onMonthChange?.(newDate)
  }

  const CustomCaption = ({ displayMonth }: { displayMonth: Date }) => {
    const monthName = displayMonth.toLocaleDateString('en-US', { month: 'long' })
    const year = displayMonth.getFullYear()

    return (
      <div className="flex justify-between items-center p-2 bg-slate-700 border-b border-slate-600">
        <div className="flex items-center gap-1">
          {/* Year navigation - double arrows */}
          <button
            type="button"
            className={cn(
              "p-1 hover:bg-slate-600 rounded transition-colors text-slate-200"
            )}
            onClick={() => navigateYear('prev')}
            title="Previous year"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          
          {/* Month navigation - single arrows */}
          <button
            type="button"
            className={cn(
              "p-1 hover:bg-slate-600 rounded transition-colors text-slate-200"
            )}
            onClick={() => navigateMonth('prev')}
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
        
        {/* Month/Year display with year picker */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1 hover:bg-slate-600 rounded transition-colors text-slate-100"
            onClick={() => setShowYearPicker(!showYearPicker)}
          >
            <span className="text-sm font-medium">
              {monthName} {year}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {showYearPicker && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-slate-100 border border-slate-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
              {yearOptions.map((yearOption) => (
                <button
                  key={yearOption}
                  type="button"
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left hover:bg-slate-200 transition-colors text-slate-700",
                    yearOption === year && "bg-green-200 text-green-800 font-medium"
                  )}
                  onClick={() => handleYearSelect(yearOption)}
                >
                  {yearOption}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Month navigation - single arrows */}
          <button
            type="button"
            className={cn(
              "p-1 hover:bg-slate-600 rounded transition-colors text-slate-200"
            )}
            onClick={() => navigateMonth('next')}
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            className={cn(
              "p-1 hover:bg-slate-600 rounded transition-colors text-slate-200"
            )}
            onClick={() => navigateYear('next')}
            title="Next year"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Close year picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showYearPicker) {
        const target = event.target as Element
        if (!target.closest('.relative')) {
          setShowYearPicker(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showYearPicker])

  return (
    <div className={cn("bg-slate-100 rounded-lg shadow-lg overflow-hidden border border-slate-300", className)}>
      {mode === "single" && (
        <DayPicker
          mode="single"
          selected={selected as Date ?? selectedDate}
          onSelect={handleDateSelect}
          month={month}
          onMonthChange={handleMonthChange}
          showOutsideDays={showOutsideDays}
          disabled={disabled}
          fromDate={fromDate}
          toDate={toDate}
          locale={locale}
          className="p-0"
          classNames={{
            months: "flex flex-col",
            month: "flex flex-col",
            caption: "hidden", 
            nav: "hidden", 
            table: "w-full border-collapse",
            head_row: "flex border-b border-slate-300 bg-slate-200",
            head_cell: "text-slate-600 w-10 h-8 text-xs font-semibold flex items-center justify-center",
            row: "flex",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
            day: cn(
              "w-10 h-10 p-0 font-normal hover:bg-slate-200 flex items-center justify-center transition-colors relative text-slate-700",
              "focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            ),
            day_selected: "bg-green-600 text-white hover:bg-green-700 rounded-full",
            day_today: "text-green-700 font-bold bg-green-100 rounded-full",
            day_outside: "text-slate-400",
            day_disabled: "text-slate-300 cursor-not-allowed",
            day_hidden: "invisible",
            ...classNames,
          }}
          components={{
            Caption: CustomCaption,
          }}
          {...restProps}
        />
      )}
      {mode === "multiple" && (
        <DayPicker
          mode="multiple"
          selected={selected as Date[]}
          onSelect={onSelect as (date: Date[] | undefined) => void}
          month={month}
          onMonthChange={handleMonthChange}
          showOutsideDays={showOutsideDays}
          disabled={disabled}
          fromDate={fromDate}
          toDate={toDate}
          locale={locale}
          className="p-0"
          classNames={{
            months: "flex flex-col",
            month: "flex flex-col",
            caption: "hidden", 
            nav: "hidden", 
            table: "w-full border-collapse",
            head_row: "flex border-b border-slate-300 bg-slate-200",
            head_cell: "text-slate-600 w-10 h-8 text-xs font-semibold flex items-center justify-center",
            row: "flex",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
            day: cn(
              "w-10 h-10 p-0 font-normal hover:bg-slate-200 flex items-center justify-center transition-colors relative text-slate-700",
              "focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            ),
            day_selected: "bg-green-600 text-white hover:bg-green-700 rounded-full",
            day_today: "text-green-700 font-bold bg-green-100 rounded-full",
            day_outside: "text-slate-400",
            day_disabled: "text-slate-300 cursor-not-allowed",
            day_hidden: "invisible",
            ...classNames,
          }}
          components={{
            Caption: CustomCaption,
          }}
          {...restProps}
        />
      )}
      
    </div>
  )
}

export { Calendar }