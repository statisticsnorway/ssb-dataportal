'use client';

import { parseAsBoolean, useQueryState } from 'nuqs';
import type { CorrespondenceMapResource } from '@/libs/data-access/klass/models';
import { withInvertedParam } from '../../utils/download-urls';
import { CorrespondenceTable } from './index';

interface CorrespondenceTableWithDirectionProps {
  sourceName: string;
  targetName: string;
  mappings: CorrespondenceMapResource[];
  downloadHref: string;
}

/**
 * Keeps the table direction in the URL so that the download dialog — which is a separate
 * route — and the table rendered behind it cannot disagree about which way round the data is.
 */
export function CorrespondenceTableWithDirection({
  sourceName,
  targetName,
  mappings,
  downloadHref,
}: Readonly<CorrespondenceTableWithDirectionProps>) {
  const [inverted, setInverted] = useQueryState('inverted', parseAsBoolean.withDefault(false));

  return (
    <CorrespondenceTable
      sourceName={sourceName}
      targetName={targetName}
      mappings={mappings}
      inverted={inverted}
      onInvertedChange={(next) => setInverted(next || null)}
      downloadHref={withInvertedParam(downloadHref, inverted)}
    />
  );
}
