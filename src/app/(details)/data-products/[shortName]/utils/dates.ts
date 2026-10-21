import { localization } from '@/libs/language';
import { DataFileSearchHitData } from '@/types/dataFileSearchHit';

const monthYearFormat = {
  month: 'short',
  year: 'numeric',
  day: undefined,
  timeZone: 'UTC', // Matches that of the server to avoid time shifts
} as Intl.DateTimeFormatOptions;
const dateLocalesByLanguage = {
  nb: 'nb-NO',
  nn: 'nn-NO',
  en: 'en-US',
} as const;

const toDate = (value: Date | string | null | undefined): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function formatPeriodString(
  dataFile: Pick<DataFileSearchHitData, 'contains_data_from' | 'contains_data_until' | 'start' | 'end'>,
) {
  const fromDate = toDate(dataFile.contains_data_from ?? dataFile.start);
  const untilDate = toDate(dataFile.contains_data_until ?? dataFile.end);
  const appLanguage = localization.getLanguage();
  const dateLocale = dateLocalesByLanguage[appLanguage as keyof typeof dateLocalesByLanguage] ?? 'en-US';
  const from = fromDate?.toLocaleDateString(dateLocale, monthYearFormat);
  const until = untilDate?.toLocaleDateString(dateLocale, monthYearFormat);
  if (from === until) {
    return from;
  }
  return `${from} - ${until}`;
}
