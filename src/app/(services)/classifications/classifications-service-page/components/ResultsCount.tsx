import { use } from 'react';
import { localization } from '@/libs/language';
import { filterAndSortClassifications } from '@/utils/filterAndSortClassifications';
import { useClassificationContext } from './classificationContext';

export const ResultsCount = () => {
  const { classificationsPromise, selectedSubjectCodes, sortOption } = useClassificationContext();
  const { data: classifications } = use(classificationsPromise);

  const totalHits = filterAndSortClassifications(classifications, selectedSubjectCodes, sortOption).length;
  if (totalHits === 0) return localization.search.noHits;

  return `${totalHits} ${localization.search.hits}`;
};
