import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { TableCell } from "../ui/table-cell"
import { THEME, STYLES } from "../theme"
import { CalculationFactor } from "@/src/types/benefitcalculator"
import { formatFactorValue } from "@/src/utils/formatters"



interface CalculationFactorsProps {
  calculationFactors: CalculationFactor[]
}

export const CalculationFactors: React.FC<CalculationFactorsProps> = ({ calculationFactors }) => {
  if (calculationFactors.length === 0) {
    return null
  }

  return (
    <Card className="shadow-sm" style={STYLES.card}>
      <CardHeader className="py-3 border-b" style={STYLES.cardHeader}>
        <CardTitle className="text-base font-semibold" style={{ color: THEME.colors.primary }}>
          Calculation Factors
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: "0" }}>
          <tbody>
            {calculationFactors.map((factor, index) => {
              if (index % 2 === 0) {
                const nextFactor = calculationFactors[index + 1]
                const isLastRow = index >= calculationFactors.length - 2

                return (
                  <tr key={factor.key}>
                    <TableCell
                      className="font-medium"
                      width="25%"
                      hasRightBorder
                      isLastRow={isLastRow}
                      style={{ color: THEME.colors.secondary }}
                    >
                      {factor.label}
                    </TableCell>
                    <TableCell
                      className="font-normal text-right"
                      width="25%"
                      hasRightBorder
                      isLastRow={isLastRow}
                      style={{ color: THEME.colors.text }}
                    >
                      {formatFactorValue(factor.key, factor.value)}
                    </TableCell>
                    {nextFactor ? (
                      <>
                        <TableCell
                          className="font-medium"
                          width="25%"
                          hasRightBorder
                          isLastRow={isLastRow}
                          style={{ color: THEME.colors.secondary }}
                        >
                          {nextFactor.label}
                        </TableCell>
                        <TableCell
                          className="font-normal text-right"
                          width="25%"
                          isLastRow={isLastRow}
                          style={{ color: THEME.colors.text }}
                        >
                          {formatFactorValue(nextFactor.key, nextFactor.value)}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        {/* <TableCell width="25%" hasRightBorder isLastRow={isLastRow} />
                        <TableCell width="25%" isLastRow={isLastRow} /> */}
                      </>
                    )}
                  </tr>
                )
              }
              return null
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
