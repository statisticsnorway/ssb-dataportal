import type { CodeTreeNode, KlassCode } from '@/types/klass-codes';

/**
 * Converts a flat array of KLASS codes into a recursive tree structure.
 *
 * Hierarchy is derived from each code's `parentCode` field. Codes whose
 * `parentCode` is `null`, `undefined`, or references a code not present in
 * the input array are treated as root-level nodes.
 *
 * The relative order of siblings is preserved (insertion order from the input).
 *
 * @param codes - Flat array of codes as returned by the KLASS API.
 * @returns Array of root `CodeTreeNode` objects, each with nested `children`.
 */
export function buildCodeTree(codes: KlassCode[]): CodeTreeNode[] {
  const nodeMap = new Map<string, CodeTreeNode>();
  for (const code of codes) {
    nodeMap.set(code.code, { code, children: [] });
  }

  const roots: CodeTreeNode[] = [];
  for (const code of codes) {
    const node = nodeMap.get(code.code)!;
    if (code.parentCode !== null && code.parentCode !== undefined && nodeMap.has(code.parentCode)) {
      nodeMap.get(code.parentCode)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
