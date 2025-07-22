export const calculateAge = (birthDate: Date, compareDate: Date): number => {
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
