import type { CodeTreeNode } from '@/types/klass-codes';

/**
 * One visible row of a code tree: the node itself plus its rendering depth.
 */
export interface FlattenedCodeTreeRow {
  node: CodeTreeNode;
  depth: number;
}

/**
 * Flattens a `CodeTreeNode[]` tree into an ordered, depth-first list of only the
 * rows that are currently visible — i.e. every root node, plus the children of
 * any node whose code is present in `expandedCodes`, recursively.
 *
 * This mirrors exactly what the tree previously rendered via recursive JSX
 * (a node's children only ever appeared when the node itself was expanded),
 * but as a plain data structure. That lets the UI layer virtualize/window the
 * result instead of mounting a component per node up front.
 *
 * @param nodes - Root-level nodes (or children of an expanded node) to flatten.
 * @param expandedCodes - Set of `code.code` values whose children should be included.
 * @param depth - Rendering depth of `nodes`; defaults to 0 for the root call.
 * @returns Ordered list of `{ node, depth }` for every currently visible row.
 */
export function flattenVisibleCodeTree(
  nodes: CodeTreeNode[],
  expandedCodes: Set<string>,
  depth = 0,
): FlattenedCodeTreeRow[] {
  const rows: FlattenedCodeTreeRow[] = [];

  for (const node of nodes) {
    rows.push({ node, depth });

    if (node.children.length > 0 && expandedCodes.has(node.code.code)) {
      rows.push(...flattenVisibleCodeTree(node.children, expandedCodes, depth + 1));
    }
  }

  return rows;
}
