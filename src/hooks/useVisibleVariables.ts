import { use, useMemo } from 'react';
import { useAuthContext } from '@/app/authContext';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { VariableStatus } from '@/libs/data-access/variable-definitions/internal/models/VariableStatus';

/**
 * Resolves a variables promise and filters the result based on authentication state.
 *
 * Unauthenticated users see only externally published variables.
 * Authenticated users see all variables.
 */
export function useVisibleVariables(variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>) {
  const { data: variables, error } = use(variablesPromise);
  const { isAuthenticated } = useAuthContext();

  const visibleVariables = useMemo(
    () =>
      isAuthenticated ? variables : variables?.filter((v) => v.variable_status === VariableStatus.PublishedExternal),
    [variables, isAuthenticated],
  );

  return { variables: visibleVariables, error };
}
