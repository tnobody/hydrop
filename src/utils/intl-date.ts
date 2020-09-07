export const intlDate = (dateToFormat: number | string | Date) => {
  const date =
    typeof dateToFormat === "string" || typeof dateToFormat === "number"
      ? new Date(dateToFormat)
      : dateToFormat;
  const options: Intl.DateTimeFormatOptions = {
    year: undefined,
    month: undefined,
    day: undefined,
    hour: '2-digit',
    minute: '2-digit'
  };
  const { locale } = Intl.NumberFormat().resolvedOptions();
  return Intl.DateTimeFormat(locale, options).format(date);
};
