"use client"

import { useState, useEffect } from "react"

import { useStore } from "@/src/store/useStore"
import { CalculationFactor, MemberData, StoreState, SubProcessData } from "../types/benefitcalculator"

export const useBenefitData = () => {
  const [memberData, setMemberData] = useState<MemberData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    dateJoinedFund: "",
    memberId: "",
    effectiveDate: "",
    calculationDate: "",
    benefitClass: "",
    paymentType: "",
    paymentTypeDesc: "",
  })

  const [subProcessData, setSubProcessData] = useState<SubProcessData>({
    pymntAmt: "",
    minBenCheck: "",
    maxBenCheck: "",
    totalVolAcctsAdd: "",
    totalVolAcctsSub: "",
    totalVolAcctsNet: "",
  })

  const [calculationFactors, setCalculationFactors] = useState<CalculationFactor[]>([])

  const { benefitcalFinalResult, benefitCalRequiredFilelds } = useStore() as StoreState

  useEffect(() => {
    if (benefitcalFinalResult?.success) {
      const memberDataFromAPI = benefitcalFinalResult.memberData ?? {}

      setMemberData({
        firstName: memberDataFromAPI.firstName || "",
        lastName: memberDataFromAPI.lastName || "",
        dateOfBirth: memberDataFromAPI.dateOfBirth || "",
        dateJoinedFund: memberDataFromAPI.dateJoinedFund || "",
        memberId: memberDataFromAPI.memberId || "",
        effectiveDate: memberDataFromAPI.effectiveDate || "",
        calculationDate: memberDataFromAPI.calculationDate || "",
        benefitClass: memberDataFromAPI.benefitClass || "",
        paymentType: memberDataFromAPI.paymentType || "",
        paymentTypeDesc: memberDataFromAPI.paymentTypeDesc || "",
      })

      setSubProcessData({
        pymntAmt: benefitcalFinalResult.subProcessData?.pymntAmt || "",
        minBenCheck: benefitcalFinalResult.subProcessData?.minBenCheck || "",
        maxBenCheck: benefitcalFinalResult.subProcessData?.maxBenCheck || "",
        totalVolAcctsAdd: benefitcalFinalResult.subProcessData?.totalVolAcctsAdd || "",
        totalVolAcctsSub: benefitcalFinalResult.subProcessData?.totalVolAcctsSub || "",
        totalVolAcctsNet: benefitcalFinalResult.subProcessData?.totalVolAcctsNet || "",
      })

      const factors = processCalculationFactors(
        memberDataFromAPI,
        benefitCalRequiredFilelds ?? [],
      )
      setCalculationFactors(factors)
    }
  }, [benefitcalFinalResult, benefitCalRequiredFilelds])

  return {
    memberData,
    subProcessData,
    calculationFactors,
  }
}

// ---- Calculation Logic ---- //

const basicMemberFields: (keyof MemberData)[] = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "dateJoinedFund",
  "memberId",
  "effectiveDate",
  "calculationDate",
  "benefitClass",
  "paymentType",
  "paymentTypeDesc",
]

function processCalculationFactors(
  memberDataFromAPI: MemberData,
  benefitCalRequiredFields: { id: string; label: string }[]
): CalculationFactor[] {
  const factors: CalculationFactor[] = []

  if (!memberDataFromAPI || !benefitCalRequiredFields) return factors

  const requiredFieldIds = new Set(benefitCalRequiredFields.map((field) => field.id.toLowerCase()))
  const fieldLabelsMap = new Map(benefitCalRequiredFields.map((field) => [field.id.toLowerCase(), field.label]))

  Object.keys(memberDataFromAPI).forEach((key) => {
    const lowerKey = key.toLowerCase()
    const isPlanNumber = lowerKey.includes("plannumber") || lowerKey.includes("plan_number")

    if (!basicMemberFields.includes(key as keyof MemberData)) {
      if (requiredFieldIds.has(lowerKey) || (isPlanNumber && !requiredFieldIds.has(lowerKey))) {
        const label = fieldLabelsMap.get(lowerKey) || formatFieldLabel(key)

        factors.push({
          key,
          label,
          value: memberDataFromAPI[key],
        })
      }
    }
  })

  return factors
}

function formatFieldLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/SGM/g, "SGM")
    .replace(/SG /g, "SG ")
    .replace(/Mult/g, "Multiple")
    .replace(/Cont/g, "Contribution")
    .replace(/Av /g, "Average ")
    .replace(/Sal/g, "Salary")
    .replace(/Ret /g, "Retirement ")
    .replace(/Prior Dt/g, "Prior Date")
    .replace(/Spec /g, "Special ")
    .replace(/Mbr /g, "Member ")
    .replace(/Disc /g, "Discount ")
    .replace(/Fact /g, "Factor ")
    .replace(/Accret/g, "Accrued Retirement")
    .replace(/Oth /g, "Other ")
    .replace(/Plan Number/g, "Plan Number")
    .replace(/Plannumber/g, "Plan Number")
}
