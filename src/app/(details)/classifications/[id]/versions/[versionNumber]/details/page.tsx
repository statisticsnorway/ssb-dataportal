'use client';

import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import DetailsView from '@/app/(details)/classifications/components/views/DetailsView';

export default function DetailsVersion() {
  const { classification, versionResource } = useVersion();
  if (!versionResource) {
    return null;
  }

  return <DetailsView classification={classification} classificationVersion={versionResource} />;
}
