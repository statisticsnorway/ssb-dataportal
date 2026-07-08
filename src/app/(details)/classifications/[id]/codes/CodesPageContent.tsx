import { CodeTree } from '@/components/code-tree';
import type { KlassCode } from '@/types/klass-codes';

interface CodesPageContentProps {
  codes: KlassCode[];
}

/**
 * Shared page body rendered by both the current-codes page and the versioned-codes page.
 * The classification layout already supplies the heading, breadcrumbs and tab chrome;
 * this component is only responsible for the tree itself.
 */
export function CodesPageContent({ codes }: Readonly<CodesPageContentProps>) {
  return <CodeTree codes={codes} />;
}
