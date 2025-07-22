export const formatDate = (dateString?: string): string => {
  if (!dateString) return "-"
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB")
  } catch (error) {
    console.error("Date formatting error:", error)
    return dateString
  }
}

export const formatCurrency = (value?: string | number): string => {
  if (!value || value === "0.0") return "$0.00"
  const numValue = Number.parseFloat(value.toString())
  if (isNaN(numValue)) return "$0.00"
  return `$${numValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export const formatFactorValue = (key: string, value: string | number | undefined): string => {
  if (key.toLowerCase().includes("sal") || key.toLowerCase().includes("salary")) {
    return formatCurrency(value)
  }
  return value?.toString() || "-"
}

export const calculateAge = (birthDate?: string, effectiveDate?: string): string | number => {
  if (!birthDate || !effectiveDate) return "-"
  try {
    const birth = new Date(birthDate)
    const effective = new Date(effectiveDate)
    let age = effective.getFullYear() - birth.getFullYear()
    const m = effective.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && effective.getDate() < birth.getDate())) {
      age--
    }
    return age
  } catch {
    return "-"
  }
}

export const getCurrentDate = (): string => {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}


export const calculateAgeforInput = (birthDate: Date, compareDate: Date): number => {
  if (!birthDate || !compareDate) return 0;

  let age = compareDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = compareDate.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && compareDate.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return Math.max(0, age);
};

export const formatDateForApi = (date: Date): string => {
  return date.toISOString().replace('Z', '+0000');
};
