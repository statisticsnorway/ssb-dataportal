'use client';

import { Dialog, Heading } from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronRightIcon, QuestionmarkCircleIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language';
import type { CodeTreeNode, KlassCode } from '@/types/klass-codes';
import { parseNotes } from '@/utils/classifications/parseNotes';
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
    <li role='treeitem' aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isSelected}>
      <div
        className={hasChildren ? `${styles.row} ${styles.expandableRow}` : styles.row}
        style={{ '--depth': depth } as React.CSSProperties}
        data-depth={depth}
      >
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
          <span className={styles.nameLabel}>{code.name}</span>
        </button>

        {code.notes && (
          <Dialog.TriggerContext>
            <Dialog.Trigger asChild>
              <button
                type='button'
                className={styles.infoButton}
                aria-label={`${localization.codeTree.notesButtonLabel} ${code.name}`}
              >
                <QuestionmarkCircleIcon fontSize='1.75rem' aria-hidden />
              </button>
            </Dialog.Trigger>
            <Dialog>
              <Dialog.Block>
                <Heading level={1} data-size='md'>
                  {code.name}
                </Heading>
              </Dialog.Block>
              <Dialog.Block>
                {parseNotes(code.notes).map((section, idx) => (
                  <div key={idx} className={styles.notesSection}>
                    {section.title && (
                      <Heading level={2} data-size='xs'>
                        {section.title}
                      </Heading>
                    )}
                    <p>{section.content}</p>
                  </div>
                ))}
              </Dialog.Block>
            </Dialog>
          </Dialog.TriggerContext>
        )}
      </div>

      {hasChildren && isExpanded && (
        <ul className={styles.children}>
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
