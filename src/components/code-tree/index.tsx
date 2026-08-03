'use client';

import { Button } from '@digdir/designsystemet-react';
import { useMemo, useState } from 'react';
import type { ClassificationItemResource } from '@/libs/data-access/klass/models/ClassificationItemResource';
import { localization } from '@/libs/language';
import type { CodeTreeNode } from '@/types/klass-codes';
import { buildCodeTree } from '@/utils/classifications/buildCodeTree';
import { CodeTreeRow } from './CodeTreeRow';
import styles from './code-tree.module.css';

export interface CodeTreeProps {
  /** Flat array of codes exactly as returned by the KLASS API (after mapping to KlassCode). */
  codes: ClassificationItemResource[];
  /** Called with the KlassCode the user clicked. Optional. */
  onChange?: (code: ClassificationItemResource) => void;
}

/** Recursively collects the code string of every node that has at least one child. */
function collectParentCodes(nodes: CodeTreeNode[]): string[] {
  return nodes.flatMap((node) => {
    const codeValue = node.code.code;

    if (!codeValue || node.children.length === 0) {
      return [];
    }

    return [codeValue, ...collectParentCodes(node.children)];
  });
}

/**
 * Expand/collapse indented tree for browsing KLASS codes.
 *
 * - All codes start collapsed; the toolbar button or chevrons let the user open them.
 * - Row-body clicks select a code (aria-pressed); chevron clicks toggle expansion.
 * - Purely presentational — no data fetching.
 */
export function CodeTree({ codes, onChange }: Readonly<CodeTreeProps>) {
  const tree = useMemo(() => buildCodeTree(codes), [codes]);
  const allParentCodes = useMemo(() => collectParentCodes(tree), [tree]);

  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(() => new Set());

  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const allExpanded = allParentCodes.length > 0 && allParentCodes.every((c) => expandedCodes.has(c));

  function handleToggle(code: string) {
    setExpandedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function handleChange(code: ClassificationItemResource) {
    const codeValue = code.code;

    if (!codeValue) {
      return;
    }

    setSelectedCode(codeValue);
    onChange?.(code);
  }

  function handleToggleAll() {
    setExpandedCodes(allExpanded ? new Set() : new Set(allParentCodes));
  }

  if (tree.length === 0) {
    return null;
  }

  return (
    <div>
      {allParentCodes.length > 0 && (
        <div className={styles.toolbar}>
          <Button variant='secondary' onClick={handleToggleAll} aria-expanded={allExpanded}>
            {allExpanded ? localization.codeTree.collapseAll : localization.codeTree.expandAll}
          </Button>
        </div>
      )}
      <div className={styles.treeCard}>
        <div className={styles.treeHeader} aria-hidden='true'>
          <span className={styles.treeHeaderCode}>{localization.codeTree.codeColumn}</span>
          <span className={styles.treeHeaderName}>{localization.codeTree.nameColumn}</span>
        </div>
        <ul className={styles.tree} aria-label={localization.codeTree.label} role='tree'>
          {tree.map((node) => (
            <CodeTreeRow
              key={node.code.code}
              node={node}
              depth={0}
              expandedCodes={expandedCodes}
              selectedCode={selectedCode}
              onToggle={handleToggle}
              onChange={handleChange}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
