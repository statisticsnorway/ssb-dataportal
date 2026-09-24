'use client';

import {
  Button,
  Dialog,
  Heading,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@digdir/designsystemet-react';
import type { ReactNode, RefObject } from 'react';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ClassificationSurface } from '@/components/classification-surface';
import { localization } from '@/libs/language';
import type { CodeTreeNode, KlassCode } from '@/types/klass-codes';
import { buildCodeTree } from '@/utils/classifications/buildCodeTree';
import { flattenVisibleCodeTree } from '@/utils/classifications/flattenVisibleCodeTree';
import { parseNotes } from '@/utils/classifications/parseNotes';
import { CodeTreeRow } from './CodeTreeRow';
import styles from './code-tree.module.css';

/** Height of a single tree row in pixels; must match `.rowContent`'s natural height. */
const ROW_HEIGHT_PX = 40;
/** Extra rows rendered above/below the visible viewport to reduce blank flashes while scrolling. */
const OVERSCAN_ROWS = 10;
/** Below this many visible rows we render everything with no windowing at all — the
 *  vast majority of classifications never approach this, so their behaviour and
 *  markup stay exactly as before. */
const VIRTUALIZE_THRESHOLD = 150;

export interface CodeTreeProps {
  /** Flat array of codes exactly as returned by the KLASS API (after mapping to KlassCode). */
  codes: KlassCode[];
  /** Called with the KlassCode the user clicked. Optional. */
  onChange?: (code: KlassCode) => void;
  toolbar?: (controls: { allExpanded: boolean; hasExpandableNodes: boolean; toggleAll: () => void }) => ReactNode;
  autoExpandAll?: boolean;
}

/** Recursively collects the code string of every node that has at least one child. */
function collectParentCodes(nodes: CodeTreeNode[]): string[] {
  return nodes.flatMap((node) =>
    node.children.length > 0 ? [node.code.code, ...collectParentCodes(node.children)] : [],
  );
}

interface VirtualWindow {
  startIndex: number;
  endIndex: number;
}

/**
 * Determines which slice of `rowCount` rows currently falls within the browser's
 * viewport, based on the *page's own scroll position* — not an inner scrollable box.
 * This keeps the tree feeling exactly like before virtualization was introduced (the
 * whole page scrolls, and the tree visually spans every row), while only ever mounting
 * a small window of `CodeTreeRow`s at a time for performance.
 *
 * Uses `containerRef.current.getBoundingClientRect().top` (viewport-relative, so it
 * already accounts for the current scroll position) together with `window.innerHeight`
 * to figure out which row indices are on/near screen. Recomputed on every `scroll`/
 * `resize` event, throttled to one recompute per animation frame.
 *
 * When `isVirtualized` is false, the full range is returned unconditionally so small/
 * typical classifications are entirely unaffected.
 */
function useWindowVirtualizedRows(
  rowCount: number,
  isVirtualized: boolean,
  containerRef: RefObject<HTMLDivElement | null>,
): VirtualWindow {
  const [range, setRange] = useState<VirtualWindow>({ startIndex: 0, endIndex: rowCount });
  const rafRef = useRef<number | null>(null);

  const recompute = useCallback(() => {
    if (!isVirtualized || !containerRef.current) {
      setRange({ startIndex: 0, endIndex: rowCount });
      return;
    }

    const top = containerRef.current.getBoundingClientRect().top;
    const firstVisibleIndex = Math.floor(Math.max(0, -top) / ROW_HEIGHT_PX);
    const viewportRowCount = Math.ceil(window.innerHeight / ROW_HEIGHT_PX);

    setRange({
      startIndex: Math.max(0, firstVisibleIndex - OVERSCAN_ROWS),
      endIndex: Math.min(rowCount, firstVisibleIndex + viewportRowCount + OVERSCAN_ROWS * 2),
    });
  }, [isVirtualized, rowCount, containerRef]);

  useEffect(() => {
    recompute();
  }, [recompute]);

  useEffect(() => {
    if (!isVirtualized) return;

    const onScrollOrResize = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        recompute();
      });
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isVirtualized, recompute]);

  return range;
}

/**
 * Expand/collapse indented tree for browsing KLASS codes.
 *
 * - All codes start collapsed; the toolbar button or chevrons let the user open them.
 * - Row-body clicks select a code (aria-pressed); chevron clicks toggle expansion.
 * - Purely presentational — no data fetching.
 */
export function CodeTree({ codes, onChange, toolbar, autoExpandAll = false }: Readonly<CodeTreeProps>) {
  const tree = useMemo(() => buildCodeTree(codes), [codes]);
  const allParentCodes = useMemo(() => collectParentCodes(tree), [tree]);

  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(() => new Set());

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [notesCode, setNotesCode] = useState<KlassCode | null>(null);

  useEffect(() => {
    if (!autoExpandAll) {
      return;
    }

    setExpandedCodes(new Set(allParentCodes));
  }, [autoExpandAll, allParentCodes]);

  const allExpanded = allParentCodes.length > 0 && allParentCodes.every((c) => expandedCodes.has(c));

  const handleToggle = useCallback((code: string) => {
    setExpandedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }, []);

  const handleChange = useCallback(
    (code: KlassCode) => {
      setSelectedCode(code.code);
      onChange?.(code);
    },
    [onChange],
  );

  const handleToggleAll = useCallback(() => {
    startTransition(() => {
      setExpandedCodes(allExpanded ? new Set() : new Set(allParentCodes));
    });
  }, [allExpanded, allParentCodes]);

  const visibleRows = useMemo(() => flattenVisibleCodeTree(tree, expandedCodes), [tree, expandedCodes]);
  const isVirtualized = visibleRows.length > VIRTUALIZE_THRESHOLD;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { startIndex, endIndex } = useWindowVirtualizedRows(visibleRows.length, isVirtualized, scrollContainerRef);

  const topSpacerHeight = startIndex * ROW_HEIGHT_PX;
  const bottomSpacerHeight = (visibleRows.length - endIndex) * ROW_HEIGHT_PX;
  const renderedRows = visibleRows.slice(startIndex, endIndex);

  return (
    <div>
      {(allParentCodes.length > 0 || toolbar) && (
        <div className={styles.toolbar}>
          {toolbar ? (
            toolbar({ allExpanded, hasExpandableNodes: allParentCodes.length > 0, toggleAll: handleToggleAll })
          ) : (
            <Button variant='secondary' onClick={handleToggleAll} aria-expanded={allExpanded}>
              {allExpanded ? localization.codeTree.collapseAll : localization.codeTree.expandAll}
            </Button>
          )}
        </div>
      )}
      <ClassificationSurface className={styles.treeCard}>
        <div ref={scrollContainerRef} className={styles.treeCardInner}>
          <Table
            border={false}
            zebra={false}
            hover={true}
            className={styles.table}
            aria-label={localization.codeTree.label}
          >
            <TableHead>
              <TableRow>
                <TableHeaderCell className={styles.treeHeaderCode}>{localization.codeTree.codeColumn}</TableHeaderCell>
                <TableHeaderCell className={styles.treeHeaderName}>{localization.codeTree.nameColumn}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody role='tree' aria-label={localization.codeTree.label}>
              {topSpacerHeight > 0 && (
                <tr style={{ height: topSpacerHeight }}>
                  <td colSpan={2} className={styles.spacerCell} />
                </tr>
              )}
              {renderedRows.map(({ node, depth }) => (
                <CodeTreeRow
                  key={node.code.code}
                  node={node}
                  depth={depth}
                  isExpanded={expandedCodes.has(node.code.code)}
                  isSelected={selectedCode === node.code.code}
                  onToggle={handleToggle}
                  onChange={handleChange}
                  onNotes={setNotesCode}
                />
              ))}
              {bottomSpacerHeight > 0 && (
                <tr style={{ height: bottomSpacerHeight }}>
                  <td colSpan={2} className={styles.spacerCell} />
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      </ClassificationSurface>
      <Dialog open={Boolean(notesCode)} onClose={() => setNotesCode(null)}>
        {notesCode && (
          <>
            <Dialog.Block>
              <Heading level={1} data-size='md'>
                {notesCode.name}
              </Heading>
            </Dialog.Block>
            <Dialog.Block>
              {parseNotes(notesCode.notes ?? '').map((section, sectionIndex) => (
                <div key={`${section.title ?? 'note'}-${section.content}-${sectionIndex}`}>
                  {section.title && (
                    <Heading level={2} data-size='xs'>
                      {section.title}
                    </Heading>
                  )}
                  <p>{section.content}</p>
                </div>
              ))}
            </Dialog.Block>
          </>
        )}
      </Dialog>
    </div>
  );
}
