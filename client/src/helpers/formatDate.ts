export const formatDate = (date: Date, formatString: 'mm/dd/yyyy' | 'mmmm yyyy' = "mm/dd/yyyy") => {
  if (formatString === 'mm/dd/yyyy') return date.toLocaleDateString();
  const options: Intl.DateTimeFormatOptions  = { month: 'long', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  return formattedDate;
}

export const formatMonthYear = (my: { month: number, year: number }): string => {
  return formatDate(new Date(my.year, my.month, 1), "mmmm yyyy");
}

export const getCurrentMonthYear = (): { month: number, year: number} => {
  const date = new Date();
  return { month: date.getMonth() + 1, year: date.getFullYear() };
}

