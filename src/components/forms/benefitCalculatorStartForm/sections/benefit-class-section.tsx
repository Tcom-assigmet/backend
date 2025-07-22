"use client"

import type React from "react"


import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { FormData, ValidationErrors } from "@/src/types/benefitcalculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import { cn } from "@/src/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"


interface BenefitClassSectionProps {
  formData: FormData
  validationErrors: ValidationErrors
  onFieldChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void
  filteredPaymentTypes: Array<{ id: string; value: string }>
  filteredPlanNumbers: Array<{ id: string; value: string; description?: string }>
  planNumberSearch: string
  onPlanNumberSearchChange: (value: string) => void
  shouldShowDateJoinedFund: boolean
  benefitClasses: Array<{ id: string; value: string }>
}

const BenefitClassSection: React.FC<BenefitClassSectionProps> = ({
  formData,
  validationErrors,
  onFieldChange,
  filteredPaymentTypes,
  filteredPlanNumbers,
  planNumberSearch,
  onPlanNumberSearchChange,
  shouldShowDateJoinedFund,
  benefitClasses,
}) => {
  return (
    <Card className="mx-6 mb-6 rounded-lg border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Benefit Class & Payment Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Benefit Class <span className="text-red-500">*</span>
            </label>
            <Select value={formData.benefitClass} onValueChange={(value) => onFieldChange("benefitClass", value)}>
              <SelectTrigger className={cn("w-full", validationErrors.benefitClass && "border-red-500")}>
                <SelectValue placeholder="Select benefit class" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {benefitClasses.map((bc) => (
                  <SelectItem key={bc.id} value={bc.id}>
                    {bc.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.benefitClass && <p className="text-sm text-red-500">{validationErrors.benefitClass}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Payment Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.paymentType}
              onValueChange={(value) => onFieldChange("paymentType", value)}
              disabled={!formData.benefitClass}
            >
              <SelectTrigger className={cn("w-full", validationErrors.paymentType && "border-red-500")}>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {filteredPaymentTypes.map((pt) => (
                  <SelectItem key={pt.id} value={pt.id}>
                    {pt.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.paymentType && <p className="text-sm text-red-500">{validationErrors.paymentType}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Plan Number <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.planNumber}
              onValueChange={(value) => onFieldChange("planNumber", value)}
              disabled={!formData.benefitClass}
            >
              <SelectTrigger className={cn("w-full h-11", validationErrors.planNumber && "border-red-500")}>
                <SelectValue placeholder="Select plan number" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px] overflow-y-auto" position="popper" sideOffset={4}>
                <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
                  <input
                    type="text"
                    placeholder="Search plan numbers..."
                    value={planNumberSearch}
                    onChange={(e) => onPlanNumberSearchChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>

                <div className="py-1">
                  {filteredPlanNumbers.map((pt) => (
                    <SelectItem
                      key={pt.id}
                      value={pt.id}
                      className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer focus:bg-blue-50 focus:outline-none"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{pt.value}</span>
                        {pt.description && <span className="text-xs text-gray-500 mt-1">{pt.description}</span>}
                      </div>
                    </SelectItem>
                  ))}
                  {filteredPlanNumbers.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      {planNumberSearch ? "No plan numbers found matching your search" : "No plan numbers available"}
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>
            {validationErrors.planNumber && <p className="text-sm text-red-500">{validationErrors.planNumber}</p>}
          </div>
        </div>

        {shouldShowDateJoinedFund && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Date Joined Fund <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateJoinedFund && "text-gray-500",
                      validationErrors.dateJoinedFund && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateJoinedFund ? format(formData.dateJoinedFund, "MM/dd/yyyy") : "mm/dd/yyyy"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateJoinedFund}
                    onSelect={(date) => onFieldChange("dateJoinedFund", date)}
                    showOutsideDays={true}
                  />
                </PopoverContent>
              </Popover>
              {validationErrors.dateJoinedFund && (
                <p className="text-sm text-red-500">{validationErrors.dateJoinedFund}</p>
              )}
            </div>
            <div></div>
            <div></div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default BenefitClassSection
