import { use, useMemo } from 'react';
import { useAuthContext } from '@/app/authContext';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { isVariablePubliclyAccessible } from '@/utils/variableAccess';

/**
 * Resolves a variables promise and filters the result based on authentication state.
 *
 * Unauthenticated users see only externally published variables.
 * Authenticated users see all variables.
 */
export function useAuthorizedVariables(variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>) {
  const { data: variables, error } = use(variablesPromise);
  const { isAuthenticated } = useAuthContext();

  const authorizedVariables = useMemo(
    () => variables?.filter((v) => isVariablePubliclyAccessible(v.variable_status, isAuthenticated)),
    [variables, isAuthenticated],
  );

  return { variables: authorizedVariables, error };
}
