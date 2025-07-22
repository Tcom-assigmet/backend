"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import DateInputComponent from "@/src/components/ui/DateInputComponent"
import { Input } from "@/src/components/ui/input"
import { cn } from "@/src/lib/utils"
import { FormData, ValidationErrors } from "@/src/types/benefitcalculator"
import type React from "react"


interface PersonalDetailsSectionProps {
  formData: FormData
  validationErrors: ValidationErrors
  onFieldChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void
  onFieldBlur: (field: keyof FormData) => void
  memberAge: number
}

const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({
  formData,
  validationErrors,
  onFieldChange,
  onFieldBlur,
  memberAge,
}) => {
  return (
    <Card className="mx-6 mb-6 rounded-lg border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium text-card-foreground">General / Personal Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.firstName}
              onChange={(e) => onFieldChange("firstName", e.target.value)}
              onBlur={() => onFieldBlur("firstName")}
              className={cn("max-w-md", validationErrors.firstName && "border-red-500")}
              placeholder="Enter first name"
            />
            {validationErrors.firstName && <p className="text-sm text-red-500">{validationErrors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.lastName}
              onChange={(e) => onFieldChange("lastName", e.target.value)}
              onBlur={() => onFieldBlur("lastName")}
              className={cn("max-w-md", validationErrors.lastName && "border-red-500")}
              placeholder="Enter last name"
            />
            {validationErrors.lastName && <p className="text-sm text-red-500">{validationErrors.lastName}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Member Id <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.memberId}
              onChange={(e) => onFieldChange("memberId", e.target.value)}
              onBlur={() => onFieldBlur("memberId")}
              className={cn("max-w-md", validationErrors.memberId && "border-red-500")}
              placeholder="Enter member ID"
            />
            {validationErrors.memberId && <p className="text-sm text-red-500">{validationErrors.memberId}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Date Of Birth <span className="text-red-500">*</span>
            </label>
            <DateInputComponent
              value={formData.dateOfBirth}
              onChange={(date) => onFieldChange("dateOfBirth", date)}
              onBlur={() => onFieldBlur("dateOfBirth")}
              placeholder="dd/mm/yyyy"
              hasError={!!validationErrors.dateOfBirth}
            />
            {validationErrors.dateOfBirth && <p className="text-sm text-red-500">{validationErrors.dateOfBirth}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Effective Date <span className="text-red-500">*</span>
            </label>
            <DateInputComponent
              value={formData.effectiveDate}
              onChange={(date) => onFieldChange("effectiveDate", date)}
              onBlur={() => onFieldBlur("effectiveDate")}
              placeholder="dd/mm/yyyy"
              hasError={!!validationErrors.effectiveDate}
            />
            {validationErrors.effectiveDate && <p className="text-sm text-red-500">{validationErrors.effectiveDate}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Calculation Date <span className="text-red-500">*</span>
            </label>
            <DateInputComponent
              value={formData.calculationDate}
              onChange={(date) => onFieldChange("calculationDate", date)}
              onBlur={() => onFieldBlur("calculationDate")}
              placeholder="dd/mm/yyyy"
              hasError={!!validationErrors.calculationDate}
            />
            {validationErrors.calculationDate && (
              <p className="text-sm text-red-500">{validationErrors.calculationDate}</p>
            )}
          </div>
        </div>

        {memberAge > 0 && (
          <div className="mt-4 p-3 bg-accent/20 rounded-md">
            <p className="text-sm text-accent-foreground">
              Member&#39;s age at effective date: <span className="font-semibold">{memberAge} years</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PersonalDetailsSection
