export const formatDate = (date: Date, formatString: 'mm/dd/yyyy' | 'mmmm yyyy' = "mm/dd/yyyy") => {
  let options: Intl.DateTimeFormatOptions = { month: '2-digit', year: 'numeric', day: '2-digit'};
  if (formatString === 'mmmm yyyy') {
    options =  { month: 'long', year: 'numeric' };
  }
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export const formatDateFromISOString = (date: string, formatString: 'mm/dd/yyyy' | 'mmmm yyyy' = "mm/dd/yyyy") => {
  const [ year, month, day ] = date.split("T")[0].split("-");
  return formatDate(new Date(`${month}/${day}/${year}`), formatString);
}

export const formatMonthYear = (my: { month: number, year: number }): string => {
  return formatDate(new Date(my.year, my.month, 1), "mmmm yyyy");
}

export const getCurrentMonthYear = (): { month: number, year: number} => {
  const date = new Date();
  return { month: date.getMonth() + 1, year: date.getFullYear() };
}

