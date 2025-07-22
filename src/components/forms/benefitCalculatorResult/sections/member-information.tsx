import type React from "react"
import { TableCell } from "../ui/table-cell"
import { THEME, STYLES } from "../theme"
import { MemberData } from "@/types/benefitcalculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateAge, formatDate } from "@/utils/formatters"


interface MemberInformationProps {
  memberData: MemberData
}

export const MemberInformation: React.FC<MemberInformationProps> = ({ memberData }) => (
  <Card className="shadow-sm" style={STYLES.card}>
    <CardHeader className="py-3 border-b" style={STYLES.cardHeader}>
      <CardTitle className="text-base font-semibold" style={{ color: THEME.colors.primary }}>
        Member Information
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: "0" }}>
        <tbody>
          <tr>
            <TableCell className="font-medium" width="25%" hasRightBorder style={{ color: THEME.colors.secondary }}>
              First Name
            </TableCell>
            <TableCell className="font-normal" width="25%" hasRightBorder style={{ color: THEME.colors.text }}>
              {memberData.firstName || "-"}
            </TableCell>
            <TableCell className="font-medium" width="25%" hasRightBorder style={{ color: THEME.colors.secondary }}>
              Last Name
            </TableCell>
            <TableCell className="font-normal" width="25%" style={{ color: THEME.colors.text }}>
              {memberData.lastName || "-"}
            </TableCell>
          </tr>
          <tr>
            <TableCell className="font-medium" hasRightBorder style={{ color: THEME.colors.secondary }}>
              Date of Birth
            </TableCell>
            <TableCell className="font-normal" hasRightBorder style={{ color: THEME.colors.text }}>
              {formatDate(memberData.dateOfBirth)}
            </TableCell>
            <TableCell className="font-medium" hasRightBorder style={{ color: THEME.colors.secondary }}>
              Effective Date
            </TableCell>
            <TableCell className="font-normal" style={{ color: THEME.colors.text }}>
              {formatDate(memberData.effectiveDate)}
            </TableCell>
          </tr>
          <tr>
            <TableCell className="font-medium" hasRightBorder isLastRow style={{ color: THEME.colors.secondary }}>
              Calculation Date
            </TableCell>
            <TableCell className="font-normal" hasRightBorder isLastRow style={{ color: THEME.colors.text }}>
              {formatDate(memberData.calculationDate)}
            </TableCell>
            <TableCell className="font-medium" hasRightBorder isLastRow style={{ color: THEME.colors.secondary }}>
              Age at Effective Date
            </TableCell>
            <TableCell className="font-normal" isLastRow style={{ color: THEME.colors.text }}>
              {calculateAge(memberData.dateOfBirth, memberData.effectiveDate)}
            </TableCell>
          </tr>
        </tbody>
      </table>
    </CardContent>
  </Card>
)
