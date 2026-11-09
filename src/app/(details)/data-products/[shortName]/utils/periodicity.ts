import { localization } from '@/libs/language';

enum Periodicity {
  DAILY,
  WEEKLY,
  MONTHLY,
  QUARTERLY,
  YEARLY,
}

export const convertPeriodicity = (periodicity: Periodicity) => {
  switch (periodicity) {
    case Periodicity.DAILY:
      return localization.dataset.periodicity.daily;
    case Periodicity.WEEKLY:
      return localization.dataset.periodicity.weekly;
    case Periodicity.MONTHLY:
      return localization.dataset.periodicity.monthly;
    case Periodicity.QUARTERLY:
      return localization.dataset.periodicity.quarterly;
    case Periodicity.YEARLY:
      return localization.dataset.periodicity.yearly;
    default:
      periodicity satisfies never;
  }
};
