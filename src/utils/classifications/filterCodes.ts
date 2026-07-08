import type { KlassCode } from '@/types/klass-codes';

/**
 * Returns codes matching the given term, plus all ancestors of each match,
 * so the tree can render matches in their proper hierarchical context.
 * Returns the original array reference when the term is empty.
 */
export function filterCodesWithAncestors(codes: KlassCode[], term: string): KlassCode[] {
  const normalizedTerm = term.trim().toLocaleLowerCase();
  if (!normalizedTerm) {
    return codes;
  }

  const byCode = new Map(codes.map((item) => [item.code, item]));
  const includedCodes = new Set<string>();

  for (const item of codes) {
    const matchesFilter =
      item.code.toLocaleLowerCase().includes(normalizedTerm) || item.name.toLocaleLowerCase().includes(normalizedTerm);

    if (!matchesFilter) {
      continue;
    }

    includedCodes.add(item.code);

    let parentCode = item.parentCode;
    while (parentCode && !includedCodes.has(parentCode)) {
      includedCodes.add(parentCode);
      parentCode = byCode.get(parentCode)?.parentCode ?? null;
    }
  }

  return codes.filter((item) => includedCodes.has(item.code));
}
