import { VariableStatus } from '@/libs/data-access/variable-definitions/internal/models';

export function isVariablePubliclyAccessible(variableStatus: VariableStatus, isAuthenticated: boolean): boolean {
  return isAuthenticated || variableStatus === VariableStatus.PublishedExternal;
}
