"use client"
import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"

import { useStore } from "@/src/store/useStore"
import { validateDate, validateDateLogic, validateMemberId, validateName } from "@/src/utils/validations"
import { calculateAge, formatDateForApi } from "@/src/utils/uilFunctions"
import { FormData, ValidationErrors } from "@/src/types/benefitcalculator"
import { BenefitCalculatorStartService } from "./services/benefit-calculator-service"
import { BENEFIT_CLASSES, PAYMENT_TYPES, PLAN_BENEFIT_MAPPING, PLAN_NUMBERS } from "../../../configs/benefitCalculatorConfigs"
import { Alert, AlertDescription } from "../../ui/alert"
import PersonalDetailsSection from "./sections/personal-details-section"
import BenefitClassSection from "./sections/benefit-class-section"
import { Button } from "../../ui/button"


interface BenefitCalculatorFormProps {
  onClose?: () => void;
  onNext?: () => void;
}

const BenefitCalculatorForm: React.FC<BenefitCalculatorFormProps> = ({ onClose, onNext }) => {
  const {
    setBenefitCalculatorTaskInitiated,
    setBenefitCalculatorProcessInstanceId,
    setBenefitCalRequiredFilelds,
    benefitCalculatorFormData,
    setBenefitCalculatorFormData,
    benefitCalculatorTaskInitiated,
    benefitCalculatorProcessInstanceId,
  } = useStore()

  // State
  const [formData, setFormData] = useState<FormData>(benefitCalculatorFormData)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [memberAge, setMemberAge] = useState(0)
  const [planNumberSearch, setPlanNumberSearch] = useState("")

  // Service instance
  const benefitCalculatorService = useMemo(() => new BenefitCalculatorStartService(), [])

  // Computed values
  const isProcessStarted = benefitCalculatorTaskInitiated && benefitCalculatorProcessInstanceId

  const filteredPaymentTypes = useMemo(() => {
    if (!formData.benefitClass) return []
    return PAYMENT_TYPES.filter((paymentType) =>
      paymentType.benefitClasses.some((bc) => bc.id === formData.benefitClass),
    )
  }, [formData.benefitClass])

  const filteredPlanNumbers = useMemo(() => {
    if (!formData.benefitClass) return []

    const matchingPlanNumbers = PLAN_BENEFIT_MAPPING.filter(
      (mapping) => mapping.benefitClass === formData.benefitClass,
    ).map((mapping) => mapping.planNumber)

    const uniquePlanNumbers = [...new Set(matchingPlanNumbers)]

    let planNumbers = PLAN_NUMBERS.filter((planNumber) => uniquePlanNumbers.includes(planNumber.id))

    if (planNumberSearch.trim()) {
      planNumbers = planNumbers.filter(
        (planNumber) =>
          planNumber.value.toLowerCase().includes(planNumberSearch.toLowerCase()) ||
          (planNumber.description && planNumber.description.toLowerCase().includes(planNumberSearch.toLowerCase())),
      )
    }

    return planNumbers
  }, [formData.benefitClass, planNumberSearch])

  const shouldShowDateJoinedFund = useMemo(() => {
    return false // Always hide Date Joined Fund for now
  }, [])

  // Callbacks
  const markFieldAsTouched = useCallback((field: keyof FormData) => {
    setTouchedFields((prev) => new Set(prev).add(field))
  }, [])

  const updateFormField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      markFieldAsTouched(field)
    },
    [markFieldAsTouched],
  )

  const handleFieldBlur = useCallback(
    (field: keyof FormData) => {
      markFieldAsTouched(field)
    },
    [markFieldAsTouched],
  )

  const handlePlanNumberSearchChange = useCallback((value: string) => {
    setPlanNumberSearch(value)
  }, [])

  // Validation
  const validateSingleField = useCallback(
    (field: keyof FormData): string | undefined => {
      const minBirthDate = new Date(1900, 0, 1)
      const maxBirthDate = new Date()
      const maxFutureDate = new Date()
      maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 10)

      switch (field) {
        case "firstName":
          return validateName(formData.firstName, "First name")
        case "lastName":
          return validateName(formData.lastName, "Last name")
        case "memberId":
          return validateMemberId(formData.memberId)
        case "dateOfBirth":
          return validateDate(formData.dateOfBirth, "Date of Birth", minBirthDate, maxBirthDate)
        case "dateJoinedFund":
          if (!shouldShowDateJoinedFund) return undefined
          return validateDate(
            formData.dateJoinedFund,
            "Date Joined Fund",
            formData.dateOfBirth ? new Date(formData.dateOfBirth.getTime()) : undefined,
          )
        case "effectiveDate":
          return validateDate(formData.effectiveDate, "Effective Date", formData.dateOfBirth, maxFutureDate)
        case "calculationDate":
          return validateDate(formData.calculationDate, "Calculation Date", formData.effectiveDate, maxFutureDate)
        case "benefitClass":
          return !formData.benefitClass ? "Benefit Class is required" : undefined
        case "paymentType":
          return !formData.paymentType ? "Payment Type is required" : undefined
        case "planNumber":
          return !formData.planNumber ? "Plan Number is required" : undefined
        default:
          return undefined
      }
    },
    [formData, shouldShowDateJoinedFund],
  )

  const validateAllFields = useCallback((): ValidationErrors => {
    const errors: ValidationErrors = {}
    const fields: (keyof FormData)[] = [
      "firstName",
      "lastName",
      "memberId",
      "dateOfBirth",
      "effectiveDate",
      "calculationDate",
      "benefitClass",
      "paymentType",
      "planNumber",
    ]

    if (shouldShowDateJoinedFund) {
      fields.push("dateJoinedFund")
    }

    fields.forEach((field) => {
      const error = validateSingleField(field)
      if (error) {
        errors[field] = error
      }
    })

    errors.dateLogic = validateDateLogic(formData)

    if (formData.benefitClass && formData.paymentType && formData.dateOfBirth && formData.effectiveDate) {
      const selectedPaymentType = PAYMENT_TYPES.find((pt) => pt.id === formData.paymentType)
      const benefitClassRule = selectedPaymentType?.benefitClasses.find((bc) => bc.id === formData.benefitClass)

      if (benefitClassRule) {
        const age = calculateAge(formData.dateOfBirth, formData.effectiveDate)

        if (
          (benefitClassRule.minAge >= 0 && age < benefitClassRule.minAge) ||
          (benefitClassRule.maxAge >= 0 && age > benefitClassRule.maxAge)
        ) {
          errors.ageValidation = `Member's age is ${age}. Valid age range for this selection is ${benefitClassRule.minAge} - ${benefitClassRule.maxAge}.`
        }
      }
    }

    Object.keys(errors).forEach((key) => {
      if (errors[key as keyof ValidationErrors] === undefined) {
        delete errors[key as keyof ValidationErrors]
      }
    })

    return errors
  }, [formData, validateSingleField, shouldShowDateJoinedFund])

  const updateValidationErrors = useCallback(() => {
    const newErrors: ValidationErrors = {}

    touchedFields.forEach((field) => {
      const error = validateSingleField(field)
      if (error) {
        newErrors[field] = error
      }
    })

    const dateFields = ["dateOfBirth", "dateJoinedFund", "effectiveDate", "calculationDate"]
    const hasDateFieldTouched = dateFields.some((field) => touchedFields.has(field as keyof FormData))

    if (hasDateFieldTouched) {
      const dateLogicError = validateDateLogic(formData)
      if (dateLogicError) {
        newErrors.dateLogic = dateLogicError
      }
    }

    const ageValidationFields = ["benefitClass", "paymentType", "dateOfBirth", "effectiveDate"]
    const hasAgeValidationFieldTouched = ageValidationFields.some((field) => touchedFields.has(field as keyof FormData))

    if (
      hasAgeValidationFieldTouched &&
      formData.benefitClass &&
      formData.paymentType &&
      formData.dateOfBirth &&
      formData.effectiveDate
    ) {
      const selectedPaymentType = PAYMENT_TYPES.find((pt) => pt.id === formData.paymentType)
      const benefitClassRule = selectedPaymentType?.benefitClasses.find((bc) => bc.id === formData.benefitClass)

      if (benefitClassRule) {
        const age = calculateAge(formData.dateOfBirth, formData.effectiveDate)

        if (
          (benefitClassRule.minAge >= 0 && age < benefitClassRule.minAge) ||
          (benefitClassRule.maxAge >= 0 && age > benefitClassRule.maxAge)
        ) {
          newErrors.ageValidation = `Member's age is ${age}. Valid age range for this selection is ${benefitClassRule.minAge} - ${benefitClassRule.maxAge}.`
        }
      }
    }

    setValidationErrors(newErrors)
  }, [touchedFields, validateSingleField, formData])

  const isFormValid = useMemo(() => {
    const errors = validateAllFields()
    const hasRequiredFieldsError =
      Object.keys(errors).length > 0 ||
      !formData.dateOfBirth ||
      !formData.effectiveDate ||
      !formData.calculationDate ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.memberId ||
      !formData.benefitClass ||
      !formData.paymentType ||
      !formData.planNumber ||
      (shouldShowDateJoinedFund && !formData.dateJoinedFund)

    return !hasRequiredFieldsError
  }, [formData, validateAllFields, shouldShowDateJoinedFund])

  // API calls
  const getPaymentTypeDescription = useCallback((paymentTypeId: string): string => {
    const paymentType = PAYMENT_TYPES.find((pt) => pt.id === paymentTypeId)
    return paymentType?.value || ""
  }, [])

  const handleSubmit = useCallback(async () => {
    const allFields: (keyof FormData)[] = [
      "firstName",
      "lastName",
      "memberId",
      "dateOfBirth",
      "effectiveDate",
      "calculationDate",
      "benefitClass",
      "paymentType",
      "planNumber",
    ]

    if (shouldShowDateJoinedFund) {
      allFields.push("dateJoinedFund")
    }

    setTouchedFields(new Set(allFields))

    const errors = validateAllFields()
    setValidationErrors(errors)

    const hasRequiredFieldsError =
      Object.keys(errors).length > 0 ||
      !formData.dateOfBirth ||
      !formData.effectiveDate ||
      !formData.calculationDate ||
      (shouldShowDateJoinedFund && !formData.dateJoinedFund)

    if (hasRequiredFieldsError) {
      return
    }

    setIsSubmitting(true)

    const paymentTypeDesc = getPaymentTypeDescription(formData.paymentType)

    const requestBody = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      memberId: formData.memberId,
      dateOfBirth: formData.dateOfBirth ? formatDateForApi(formData.dateOfBirth) : undefined,
      dateJoinedFund: formData.dateJoinedFund
        ? formatDateForApi(formData.dateJoinedFund)
        : formatDateForApi(new Date(2000, 0, 1)),
      effectiveDate: formData.effectiveDate ? formatDateForApi(formData.effectiveDate) : undefined,
      calculationDate: formData.calculationDate ? formatDateForApi(formData.calculationDate) : undefined,
      benefitClass: formData.benefitClass,
      paymentType: formData.paymentType,
      planNumber: formData.planNumber,
      paymentTypeDesc: paymentTypeDesc,
    }

    try {
      const response = await benefitCalculatorService.startProcess(requestBody)

      setBenefitCalculatorTaskInitiated(true)
      setBenefitCalculatorProcessInstanceId(response.processInstanceId)
      setBenefitCalRequiredFilelds(response.requiredFields || [])

      console.log("Process started successfully:", response)

      if (onNext) {
        onNext()
      } else if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error("Failed to start process:", error)
      setValidationErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : "Failed to start process. Please try again.",
      }))
    } finally {
      setIsSubmitting(false)
    }
  }, [
    formData,
    shouldShowDateJoinedFund,
    validateAllFields,
    getPaymentTypeDescription,
    benefitCalculatorService,
    setBenefitCalculatorTaskInitiated,
    setBenefitCalculatorProcessInstanceId,
    setBenefitCalRequiredFilelds,
    onNext,
    onClose,
  ])

  const handleNext = useCallback(async () => {
    const allFields: (keyof FormData)[] = [
      "firstName",
      "lastName",
      "memberId",
      "dateOfBirth",
      "effectiveDate",
      "calculationDate",
      "benefitClass",
      "paymentType",
      "planNumber",
    ]

    if (shouldShowDateJoinedFund) {
      allFields.push("dateJoinedFund")
    }

    setTouchedFields(new Set(allFields))
    const errors = validateAllFields()
    setValidationErrors(errors)

    if (!isFormValid) return

    const resetFormState = () => {
      setTouchedFields(new Set())
      setValidationErrors({})
    }

    if (isProcessStarted) {
      resetFormState()
      onNext?.()
      await handleSubmit()
    } else {
      await handleSubmit()
      resetFormState()
    }
  }, [isFormValid, isProcessStarted, shouldShowDateJoinedFund, validateAllFields, handleSubmit, onNext])

  // Effects
  useEffect(() => {
    setBenefitCalculatorFormData(formData)
  }, [formData, setBenefitCalculatorFormData])

  useEffect(() => {
    if (formData.dateOfBirth && formData.effectiveDate) {
      setMemberAge(calculateAge(formData.dateOfBirth, formData.effectiveDate))
    } else {
      setMemberAge(0)
    }
  }, [formData.dateOfBirth, formData.effectiveDate])

  useEffect(() => {
    if (formData.paymentType && !filteredPaymentTypes.some((pt) => pt.id === formData.paymentType)) {
      updateFormField("paymentType", "")
    }
    if (formData.planNumber && !filteredPlanNumbers.some((pn) => pn.id === formData.planNumber)) {
      updateFormField("planNumber", "")
    }
    if (!shouldShowDateJoinedFund && formData.dateJoinedFund) {
      updateFormField("dateJoinedFund", undefined)
    }
  }, [
    formData.benefitClass,
    formData.paymentType,
    formData.planNumber,
    filteredPaymentTypes,
    filteredPlanNumbers,
    updateFormField,
    shouldShowDateJoinedFund,
    formData.dateJoinedFund,
  ])

  useEffect(() => {
    updateValidationErrors()
  }, [updateValidationErrors])

  return (
          <div className="bg-card rounded-md shadow-sm">
              <div className="border-b border-border px-6 py-4">
          <h1 className="text-xl font-medium text-foreground">Equip Benefit Calculator</h1>
        </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleNext()
        }}
      >
        <div className="flex justify-end px-6 py-2"></div>

        {isProcessStarted && (
          <div className="mx-6 mb-6">
            <Alert>
              <AlertDescription>
                Process is already started. You can proceed to the next step or modify the form data.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <PersonalDetailsSection
          formData={formData}
          validationErrors={validationErrors}
          onFieldChange={updateFormField}
          onFieldBlur={handleFieldBlur}
          memberAge={memberAge}
        />

        {(validationErrors.submit || validationErrors.ageValidation || validationErrors.dateLogic) && (
          <div className="mx-6 mb-6">
            <Alert variant="destructive">
              <AlertDescription>
                {validationErrors.submit || validationErrors.ageValidation || validationErrors.dateLogic}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <BenefitClassSection
          formData={formData}
          validationErrors={validationErrors}
          onFieldChange={updateFormField}
          filteredPaymentTypes={filteredPaymentTypes}
          filteredPlanNumbers={filteredPlanNumbers}
          planNumberSearch={planNumberSearch}
          onPlanNumberSearchChange={handlePlanNumberSearchChange}
          shouldShowDateJoinedFund={shouldShowDateJoinedFund}
          benefitClasses={BENEFIT_CLASSES}
        />

        <div className="border-t border-border px-6 py-4 flex justify-between">
          <div></div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Processing..." : isProcessStarted ? "Next: Enter Details" : "Start Process & Continue"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default BenefitCalculatorForm
