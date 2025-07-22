import type React from "react"
import { THEME } from "../theme"

interface CurrencyFieldRowProps {
  label: string
  value: string | number
  highlight?: boolean
}

export const CurrencyFieldRow: React.FC<CurrencyFieldRowProps> = ({ label, value, highlight = false }) => (
  <tr style={{ borderBottom: `1px solid ${THEME.colors.borderLight}` }}>
    <td
      className="font-medium"
      style={{
        color: THEME.colors.secondary,
        fontSize: THEME.typography.sm,
        paddingRight: THEME.spacing.md,
        paddingTop: THEME.spacing.md,
        paddingBottom: THEME.spacing.md,
      }}
    >
      {label}
    </td>
    <td
      className={`font-semibold text-right ${highlight ? "text-green-700" : ""}`}
      style={{
        color: highlight ? THEME.colors.success : THEME.colors.text,
        fontSize: THEME.typography.sm,
        width: "35%",
        paddingLeft: THEME.spacing.md,
        paddingRight: THEME.spacing.xl,
        paddingTop: THEME.spacing.md,
        paddingBottom: THEME.spacing.md,
      }}
    >
      {value}
    </td>
  </tr>
)
