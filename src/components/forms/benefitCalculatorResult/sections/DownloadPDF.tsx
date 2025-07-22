"use client";

import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import BenefitPdfDocument from "../BenefitPdfDocument";
import { getCurrentDate } from "@/utils/formatters";
import { CalculationFactor, MemberData, SubProcessData } from "@/types/benefitcalculator";

interface DownloadPDFProps {
  memberData: MemberData;
  subProcessData: SubProcessData;
  calculationFactors: CalculationFactor[];
}

const DownloadPDF: React.FC<DownloadPDFProps> = ({
  memberData,
  subProcessData,
  calculationFactors,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const today = getCurrentDate();

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const fileName = `Benefit_Statement_${memberData.firstName}_${memberData.lastName}.pdf`;
      const blob = await pdf(
        <BenefitPdfDocument
          memberData={memberData}
          subProcessData={subProcessData}
          calculationFactors={calculationFactors}
          today={today}
        />
      ).toBlob();
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownloadPDF}
      disabled={isDownloading}
      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors"
    >
      {isDownloading ? "Downloading..." : "Download PDF"}
    </button>
  );
};

export default DownloadPDF;