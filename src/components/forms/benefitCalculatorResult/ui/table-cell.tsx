import type React from "react"
import { THEME } from "../theme"

interface TableCellProps {
  children: React.ReactNode
  className?: string
  width?: string
  isLastRow?: boolean
  hasRightBorder?: boolean
  style?: React.CSSProperties
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = "",
  width,
  isLastRow = false,
  hasRightBorder = false,
  style = {},
}) => {
  const cellStyle: React.CSSProperties = {
    fontSize: THEME.typography.sm,
    padding: THEME.spacing.lg,
    borderBottom: !isLastRow ? `1px solid ${THEME.colors.borderLight}` : "none",
    borderRight: hasRightBorder ? `1px solid ${THEME.colors.borderLight}` : "none",
    width,
    ...style,
  }

  return (
    <td className={className} style={cellStyle}>
      {children}
    </td>
  )
}
