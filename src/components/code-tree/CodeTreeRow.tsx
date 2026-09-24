'use client';

import { TableCell, TableRow } from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronRightIcon, QuestionmarkCircleIcon } from '@navikt/aksel-icons';
import { memo } from 'react';
import { localization } from '@/libs/language';
import type { CodeTreeNode, KlassCode } from '@/types/klass-codes';
import styles from './code-tree.module.css';

interface CodeTreeRowProps {
  node: CodeTreeNode;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: (code: string) => void;
  onChange: (code: KlassCode) => void;
  onNotes: (code: KlassCode) => void;
}

/**
 * Renders a single row in the code tree.
 *
 * This component is intentionally non-recursive: the parent `CodeTree` flattens the
 * visible rows (via `flattenVisibleCodeTree`) into a plain list and mounts one
 * `CodeTreeRow` per visible row, which is what makes windowing/virtualization possible
 * for very large classifications.
 *
 * Clicking the row body selects the code and, for parent nodes, also toggles expansion.
 * Clicking the chevron only toggles expansion without affecting selection.
 */
function CodeTreeRowComponent({
  node,
  depth,
  isExpanded,
  isSelected,
  onToggle,
  onChange,
  onNotes,
}: Readonly<CodeTreeRowProps>) {
  const { code } = node;
  const hasChildren = node.children.length > 0;

  const activateRow = () => {
    onChange(code);
    if (hasChildren) onToggle(code.code);
  };

  const hasTextSelection = () => {
    const selection = window.getSelection();
    return Boolean(selection && selection.toString().trim().length > 0);
  };

  return (
    <TableRow
      role='treeitem'
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      className={hasChildren ? `${styles.row} ${styles.expandableRow}` : styles.row}
      style={{ '--depth': depth } as React.CSSProperties}
      data-depth={depth}
    >
      <TableCell className={`${styles.treeCell} ${styles.codeCell}`}>
        <div className={styles.rowContent}>
          {hasChildren ? (
            <button
              type='button'
              className={styles.chevronButton}
              aria-expanded={isExpanded}
              aria-label={
                isExpanded
                  ? `${localization.codeTree.collapse} ${code.name}`
                  : `${localization.codeTree.expand} ${code.name}`
              }
              onClick={() => onToggle(code.code)}
            >
              {isExpanded ? (
                <ChevronDownIcon fontSize='1.25rem' aria-hidden />
              ) : (
                <ChevronRightIcon fontSize='1.25rem' aria-hidden />
              )}
            </button>
          ) : (
            <span className={styles.chevronPlaceholder} aria-hidden='true' />
          )}

          <span className={styles.codeLabel}>{code.code}</span>
        </div>
      </TableCell>
      <TableCell className={`${styles.treeCell} ${styles.nameCell}`}>
        <div className={styles.rowContent}>
          <div
            role='button'
            tabIndex={0}
            className={styles.rowBody}
            aria-label={`${localization.codeTree.selectCode} ${code.code}: ${code.name}`}
            aria-pressed={isSelected}
            onClick={() => {
              if (hasTextSelection()) return;
              activateRow();
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              activateRow();
            }}
          >
            <span className={styles.nameLabel}>{code.name}</span>
          </div>

          {code.notes && (
            <button
              type='button'
              className={styles.infoButton}
              aria-label={`${localization.codeTree.notesButtonLabel} ${code.name}`}
              onClick={() => onNotes(code)}
            >
              <QuestionmarkCircleIcon fontSize='1.75rem' aria-hidden />
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

/**
 * `onToggle`/`onChange`/`onNotes` are stable callback refs from the parent (via
 * `useCallback`), so a plain equality check on every prop is enough here: unlike the
 * previous recursive version, this component no longer receives tree-wide state
 * (`expandedCodes`/`selectedCode`) directly, so there's no need to derive per-row
 * booleans inside the comparator — `isExpanded`/`isSelected` are already primitives.
 */
function propsAreEqual(prev: Readonly<CodeTreeRowProps>, next: Readonly<CodeTreeRowProps>): boolean {
  return (
    prev.node === next.node &&
    prev.depth === next.depth &&
    prev.isExpanded === next.isExpanded &&
    prev.isSelected === next.isSelected &&
    prev.onToggle === next.onToggle &&
    prev.onChange === next.onChange &&
    prev.onNotes === next.onNotes
  );
}

export const CodeTreeRow = memo(CodeTreeRowComponent, propsAreEqual);
