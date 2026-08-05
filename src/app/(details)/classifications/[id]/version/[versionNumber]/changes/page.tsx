'use client';

import { notFound } from 'next/navigation';
import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import ChangesView from '@/app/(details)/classifications/components/views/ChangesView';

export default function ChangesVersion() {
  const { classification, versionResource } = useVersion();

  if (!versionResource?.classificationItems) {
    return notFound();
  }

  return <ChangesView classification={classification} version={versionResource} />;
}
