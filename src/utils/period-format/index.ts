import { type DaplaDataFileDTO, PeriodFormat } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';

export const PERIOD_FORMAT_ORDER = [
  PeriodFormat.YEAR_MONTH_DAY,
  PeriodFormat.YEAR_WEEK,
  PeriodFormat.YEAR_MONTH,
  PeriodFormat.BIMESTER,
  PeriodFormat.QUARTER,
  PeriodFormat.TRIANNUAL,
  PeriodFormat.HALF_YEAR,
  PeriodFormat.YEAR,
] as const satisfies readonly PeriodFormat[];

export const getPeriodFormatLabel = (format: PeriodFormat): string => localization.dataset.periodicity.periodFormat[format];

export const getPeriodFormats = (files: Pick<DaplaDataFileDTO, 'period_type'>[]): PeriodFormat[] => {
  const present = new Set(files.map((f) => f.period_type).filter((p): p is PeriodFormat => p != null));
  return PERIOD_FORMAT_ORDER.filter((format) => present.has(format));
};