'use client';
import { localization } from '@/libs/language/src/localization';
import { useVariableDefinitionsContext } from './variableDefinitionContext';

export const ResultsCount = () => {
  const { filteredVariables, error } = useVariableDefinitionsContext();

  if (error) return null;

  const totalHits = filteredVariables.length;
  if (totalHits === 0) return localization.search.noHits;

  return `${totalHits} ${localization.search.hits}`;
};
