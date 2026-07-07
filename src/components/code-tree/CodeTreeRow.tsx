'use client';

import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language';
import type { CodeTreeNode, KlassCode } from '@/types/klass-codes';
import styles from './code-tree.module.css';

interface CodeTreeRowProps {
  node: CodeTreeNode;
  depth: number;
  expandedCodes: Set<string>;
  selectedCode: string | null;
  onToggle: (code: string) => void;
  onChange: (code: KlassCode) => void;
}

/**
 * Renders a single row in the code tree, recursing into children when expanded.
 *
 * Clicking the row body selects the code and, for parent nodes, also toggles expansion.
 * Clicking the chevron only toggles expansion without affecting selection.
 */
export function CodeTreeRow({
  node,
  depth,
  expandedCodes,
  selectedCode,
  onToggle,
  onChange,
}: Readonly<CodeTreeRowProps>) {
  const { code } = node;
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedCodes.has(code.code);
  const isSelected = selectedCode === code.code;

  return (
    <li role='treeitem' aria-expanded={hasChildren ? isExpanded : undefined}>
      <div className={styles.row} style={{ paddingLeft: `${depth * 1.5}rem` }}>
        {hasChildren ? (
          <button
            type='button'
            className={styles.chevronButton}
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

        <button
          type='button'
          className={styles.rowBody}
          aria-label={`${localization.codeTree.selectCode} ${code.code}: ${code.name}`}
          aria-pressed={isSelected}
          onClick={() => {
            onChange(code);
            if (hasChildren) onToggle(code.code);
          }}
        >
          <span className={styles.codeLabel}>{code.code}</span>
          <span className={styles.separator} aria-hidden='true'>
            –
          </span>
          <span className={styles.nameLabel}>{code.name}</span>
        </button>
      </div>

      {hasChildren && isExpanded && (
        <ul className={styles.children} role='group'>
          {node.children.map((child) => (
            <CodeTreeRow
              key={child.code.code}
              node={child}
              depth={depth + 1}
              expandedCodes={expandedCodes}
              selectedCode={selectedCode}
              onToggle={onToggle}
              onChange={onChange}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
