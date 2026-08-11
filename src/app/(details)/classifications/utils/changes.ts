import { CodeChangeItem } from '@/libs/data-access/klass';

export type GroupedChanges = {
  newCodeKey: string;
  changes: CodeChangeItem[];
};

/**
 * Groups code changes by `newCode`, or by `oldCode` when `inverted` is `true`.
 * Preserves insertion order. Missing keys fall back to a sentinel value.
 *
 * @param changes - Flat list of code changes.
 * @param inverted - Group by `oldCode` instead of `newCode`.
 * @returns Groups keyed by the chosen code.
 */
export function groupChanges(changes: CodeChangeItem[], inverted: boolean): GroupedChanges[] {
  return changes.reduce<GroupedChanges[]>((groups, change) => {
    const groupKey = inverted
      ? (change.oldCode ?? '__undefined_old_code__')
      : (change.newCode ?? '__undefined_new_code__');
    const existingGroup = groups.find((group) => group.newCodeKey === groupKey);

    if (existingGroup) {
      existingGroup.changes.push(change);
      return groups;
    }

    groups.push({ newCodeKey: groupKey, changes: [change] });
    return groups;
  }, []);
}
