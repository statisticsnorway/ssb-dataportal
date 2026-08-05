export function getDayBeforeDate(date: Date): Date {
  const dayBefore = new Date(date.getTime());
  dayBefore.setDate(date.getDate() - 1);
  return dayBefore;
}
