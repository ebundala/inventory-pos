export function useThisYearDateRange() {
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11 + 1, 0);
  return [startDate, endDate];
}
