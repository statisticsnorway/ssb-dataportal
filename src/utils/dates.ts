export function getDayBeforeDate(date: Date): Date {
  const dayBefore = new Date(date);
  dayBefore.setDate(date.getDate() - 1);
  return dayBefore;
}
