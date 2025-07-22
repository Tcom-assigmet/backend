import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableCell } from "../ui/table-cell"
import { THEME, STYLES } from "../theme"
import { MemberData } from "@/types/benefitcalculator"

interface BenefitDetailsProps {
  memberData: MemberData
}

export const BenefitDetails: React.FC<BenefitDetailsProps> = ({ memberData }) => (
  <Card className="shadow-sm" style={STYLES.card}>
    <CardHeader className="py-3 border-b" style={STYLES.cardHeader}>
      <CardTitle className="text-base font-semibold" style={{ color: THEME.colors.primary }}>
        Benefit Details
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: "0" }}>
        <tbody>
          <tr>
            <TableCell
              className="font-medium"
              width="25%"
              hasRightBorder
              isLastRow
              style={{ color: THEME.colors.secondary }}
            >
              Benefit Class
            </TableCell>
            <TableCell
              className="font-normal"
              width="25%"
              hasRightBorder
              isLastRow
              style={{ color: THEME.colors.text }}
            >
              {memberData.benefitClass || "-"}
            </TableCell>
            <TableCell
              className="font-medium"
              width="25%"
              hasRightBorder
              isLastRow
              style={{ color: THEME.colors.secondary }}
            >
              Payment Type
            </TableCell>
            <TableCell className="font-normal" width="25%" isLastRow style={{ color: THEME.colors.text }}>
              {memberData.paymentTypeDesc || "-"}
            </TableCell>
          </tr>
        </tbody>
      </table>
    </CardContent>
  </Card>
)
