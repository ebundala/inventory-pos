
export function useGetDateRanges(start: Date, end: Date) {
  const dates: Date[] = [];
  const temp = new Date(start);
  dates.push(start);
  while (temp < end) {
    temp.setUTCDate(temp.getUTCDate() + 1);
    dates.push(new Date(temp));
  }
  return dates;
}
