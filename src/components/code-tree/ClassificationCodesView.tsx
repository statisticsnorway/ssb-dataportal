'use client';

import type { KlassCode } from '@/types/klass-codes';
import { CodeTree } from '.';

interface ClassificationCodesViewProps {
  /** Flat array of codes as returned by the KLASS API (after mapping). No fetching here. */
  codes: KlassCode[];
}

/**
 * Thin client shell that renders a CodeTree for browsing KLASS codes.
 * Selection state is intentionally absent — rows expand/collapse only.
 */
export function ClassificationCodesView({ codes }: ClassificationCodesViewProps) {
  return <CodeTree codes={codes} />;
}
