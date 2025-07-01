export const formatDate = (date: Date, formatString: 'mm/dd/yyyy' | 'mmmm yyyy' = "mm/dd/yyyy") => {
  let options: Intl.DateTimeFormatOptions = { month: 'numeric', year: 'numeric', day: 'numeric'};
  if (formatString === 'mmmm yyyy') {
    options =  { month: 'long', year: 'numeric' };
  }
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export const formatMonthYear = (my: { month: number, year: number }): string => {
  return formatDate(new Date(my.year, my.month, 1), "mmmm yyyy");
}

export const getCurrentMonthYear = (): { month: number, year: number} => {
  const date = new Date();
  return { month: date.getMonth() + 1, year: date.getFullYear() };
}

