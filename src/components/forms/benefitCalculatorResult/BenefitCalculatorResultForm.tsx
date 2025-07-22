"use client";

import type React from "react";
import { useRef } from "react";
import { THEME } from "./theme";
import { useBenefitData } from "@/src/hooks/use-benefit-data";
import { MemberInformation } from "./sections/member-information";
import { BenefitDetails } from "./sections/benefit-details";
import { CalculationFactors } from "./sections/calculation-factors";
import { BenefitCalculationSummary } from "./sections/benefit-calculation-summary";
import Image from "next/image";
import { getCurrentDate } from "@/src/utils/formatters";
import DownloadPDF from "./sections/DownloadPDF";

const BenefitCalculatorResult: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const { memberData, subProcessData, calculationFactors } = useBenefitData();
  const today = getCurrentDate();

  return (
    <div
      className="min-h-screen p-6 w-auto"
      style={{ backgroundColor: THEME.colors.borderLight }}
    >
      <div
        id="element-id"
        ref={printRef}
        className="max-w-5xl mx-auto space-y-6 border-1"
        style={{
          backgroundColor: THEME.colors.background,
          padding: THEME.spacing.lg,
          borderRadius: "8px",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="text-right">
            <p
              className="text-lg font-semibold"
              style={{ color: THEME.colors.secondary }}
            >
              Benefit Calculation Statement
            </p>
            <p className="text-sm" style={{ color: THEME.colors.textMuted }}>
              Generated: {today}
            </p>
          </div>
        </div>

        {/* <MemberIdBanner memberId={memberData.memberId} paymentTypeDesc={memberData.paymentTypeDesc} /> */}
         <div
    className="rounded-md p-4 flex justify-between items-center"
    style={{
      backgroundColor: THEME.colors.background,
      border: `1px solid ${THEME.colors.accent}`,
    }}
  >
    <div>
      <p className="text-sm font-medium" style={{ color: THEME.colors.secondary }}>
        Member ID: {memberData.memberId || "-"}
      </p>
    </div>
    <div
      className="px-3 py-1 rounded-md border"
      style={{
        backgroundColor: THEME.colors.primaryLight,
        borderColor: THEME.colors.accent,
      }}
    >
      <p className="text-sm font-medium" style={{ color: THEME.colors.primary }}>
        {memberData.paymentTypeDesc || "Benefit Calculation"}
      </p>
    </div>
  </div>

        <MemberInformation memberData={memberData} />

        <BenefitDetails memberData={memberData} />

        <CalculationFactors calculationFactors={calculationFactors} />

        <BenefitCalculationSummary
          memberData={memberData}
          subProcessData={subProcessData}
        />

        <div className="flex justify-between text-xs pt-2" style={{ color: THEME.colors.textMuted }}>
    <span>This statement is generated automatically and is for informational purposes only.</span>
  </div>
      </div>

     <div className="max-w-5xl mx-auto mt-6 flex justify-end space-x-4">
  <DownloadPDF
    memberData={memberData}
    subProcessData={subProcessData}
    calculationFactors={calculationFactors}
  />
</div>
    </div>
  );
};

export default BenefitCalculatorResult;
