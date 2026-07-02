'use client';

import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language/src/localization';
import type { CodeTreeNode, KlassCode } from '@/types/klass-codes';
import styles from './code-tree.module.css';

interface CodeTreeRowProps {
  node: CodeTreeNode;
  depth: number;
  expandedCodes: Set<string>;
  onToggle: (code: string) => void;
  onChange: (code: KlassCode) => void;
}

/**
 * Renders a single row in the code tree, recursing into children when expanded.
 *
 * For parent nodes: both the chevron button and the row body toggle expand/collapse.
 * For leaf nodes: clicking the row body fires onChange.
 */
export function CodeTreeRow({ node, depth, expandedCodes, onToggle, onChange }: CodeTreeRowProps) {
  const { code } = node;
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedCodes.has(code.code);

  return (
    <li>
      <div className={styles.row} style={{ paddingLeft: `${depth * 1.5}rem` }}>
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
            {isExpanded ? <ChevronDownIcon fontSize='1.25rem' /> : <ChevronRightIcon fontSize='1.25rem' />}
          </button>
        ) : (
          <span className={styles.chevronPlaceholder} aria-hidden='true' />
        )}

        <button
          type='button'
          className={styles.rowBody}
          aria-label={`${code.code}: ${code.name}`}
          onClick={() => {
            if (hasChildren) onToggle(code.code);
            else onChange(code);
          }}
        >
          <span className={styles.codeLabel}>{code.code}</span>
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
              onToggle={onToggle}
              onChange={onChange}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
