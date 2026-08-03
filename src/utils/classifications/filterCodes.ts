import { ClassificationItemResource } from '@/libs/data-access/klass/models/ClassificationItemResource';

function normalize(value: string | null | undefined): string {
  return value?.trim().toLocaleLowerCase() ?? '';
}

export function filterCodesWithAncestors(
  codes: ClassificationItemResource[] | null | undefined,
  term: string | null | undefined,
): ClassificationItemResource[] {
  const safeCodes = codes ?? [];
  const normalizedTerm = normalize(term);

  if (!normalizedTerm) {
    return safeCodes;
  }

  const byCode = new Map(safeCodes.filter((item) => item?.code).map((item) => [item.code!, item]));

  const includedCodes = new Set<string>();

  for (const item of safeCodes) {
    const code = item?.code;
    const name = normalize(item?.name);

    if (!code) {
      continue;
    }

    const matchesFilter = normalize(code).includes(normalizedTerm) || name.includes(normalizedTerm);

    if (!matchesFilter) {
      continue;
    }

    includedCodes.add(code);

    let parentCode = item?.parentCode ?? null;
    while (parentCode && !includedCodes.has(parentCode)) {
      includedCodes.add(parentCode);
      parentCode = byCode.get(parentCode)?.parentCode ?? null;
    }
  }

  return safeCodes.filter((item) => {
    const code = item?.code;
    return !!code && includedCodes.has(code);
  });
}
