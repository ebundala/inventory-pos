export function useGetDaysAgo(end: Date, days: number) {
  const dates: Date[] = [];
  const startDate = new Date(end);
  for (let i = 0; i < days; i++) {
    startDate.setUTCDate(startDate.getUTCDate() - 1);
  }
  return [startDate, end];
}
