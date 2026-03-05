'use client';
import { useFilteredVariables } from '@/hooks/useFilteredVariables';
import { localization } from '@/libs/language/src/localization';
import { useVariableDefinitionsContext } from './variableDefinitionContext';

/**
 * ResultsCount displays the number of search results.
 *
 * It uses the `useVariableDefinitionsContext` to access the filtered list
 * of variables and calculates the total number of hits. It displays a
 * message indicating the number of hits, or a "no hits" message if the
 * filtered list is empty. It returns null if there is an error.
 *
 * @returns A string indicating the number of hits, or null if there is an error.
 */
export const ResultsCount = () => {
  const { error, variablesPromise, textFilter, subjectFilters, statusFilters, sortOption } =
    useVariableDefinitionsContext();

  if (error) return null;

  const { filteredVariables } = useFilteredVariables({
    variablesPromise,
    textFilter,
    subjectFilters,
    statusFilters,
    sortOption,
  });

  const totalHits = filteredVariables.length;
  if (totalHits === 0) return localization.search.noHits;

  return `${totalHits} ${localization.search.hits}`;
};
