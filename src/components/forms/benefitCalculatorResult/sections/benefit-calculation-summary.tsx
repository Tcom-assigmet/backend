import type React from "react"
import { THEME, STYLES } from "../theme"
import { Separator } from "@radix-ui/react-select"
import { formatCurrency } from "@/src/utils/formatters"
import { CurrencyFieldRow } from "../ui/currency-field-row"
import { MemberData, SubProcessData } from "@/src/types/benefitcalculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"

interface BenefitCalculationSummaryProps {
  memberData: MemberData
  subProcessData: SubProcessData
}

export const BenefitCalculationSummary: React.FC<BenefitCalculationSummaryProps> = ({ memberData, subProcessData }) => (
  <Card className="shadow-sm" style={{ borderColor: THEME.colors.accent, backgroundColor: THEME.colors.background }}>
    <CardHeader className="py-3 border-b" style={STYLES.cardHeader}>
      <CardTitle className="text-base font-semibold" style={{ color: THEME.colors.primary }}>
        Benefit Calculation Summary
      </CardTitle>
    </CardHeader>
    <CardContent style={{ padding: THEME.spacing.xl }}>
      <div style={{ marginBottom: THEME.spacing.xl }}>
        {/* Benefit Payment Section */}
        <div style={{ marginBottom: THEME.spacing.xl }}>
          <h3
            className="font-medium mb-4"
            style={{
              color: THEME.colors.primary,
              fontSize: THEME.typography.sm,
              marginBottom: THEME.spacing.lg,
            }}
          >
            Benefit Payment
          </h3>
          <table className="w-full">
            <tbody>
              <CurrencyFieldRow label="Payment Type" value={memberData.paymentTypeDesc || "-"} />
              <CurrencyFieldRow
                label="Payment Amount"
                value={formatCurrency(subProcessData.pymntAmt)}
                highlight={true}
              />
              <CurrencyFieldRow
                label="Minimum Check"
                value={subProcessData.minBenCheck === "0.00" ? "N/A" : formatCurrency(subProcessData.minBenCheck)}
              />
              <CurrencyFieldRow
                label="Maximum Check"
                value={subProcessData.maxBenCheck === "" ? "N/A" : formatCurrency(subProcessData.maxBenCheck)}
              />
            </tbody>
          </table>
        </div>

        <Separator className="my-6" style={{ backgroundColor: THEME.colors.accent }} />

        {/* Voluntary Accounts Section */}
        <div>
          <h3
            className="font-medium mb-4"
            style={{
              color: THEME.colors.primary,
              fontSize: THEME.typography.sm,
              marginBottom: THEME.spacing.lg,
            }}
          >
            Voluntary Accounts
          </h3>
          <table className="w-full">
            <tbody>
              <CurrencyFieldRow
                label="Total Voluntary Accounts (additions)"
                value={formatCurrency(subProcessData.totalVolAcctsAdd)}
              />
              <CurrencyFieldRow
                label="Total Voluntary Accounts (subtractions)"
                value={formatCurrency(subProcessData.totalVolAcctsSub)}
              />
              <CurrencyFieldRow
                label="Net Value of Voluntary Accounts"
                value={formatCurrency(subProcessData.totalVolAcctsNet)}
                highlight={true}
              />
            </tbody>
          </table>
        </div>
      </div>
    </CardContent>
  </Card>
)
