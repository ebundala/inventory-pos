export function useTodayDateRange() {
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, month, day);
  const endDate = new Date(year, month, day, 23, 59, 59);
  return [startDate, endDate];
}
