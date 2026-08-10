'use client';

import { notFound } from 'next/navigation';
import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import { CodesView } from '@/app/(details)/classifications/components/views/CodesView';

export default function CodesVersion() {
  const { versionResource } = useVersion();

  if (!versionResource?.classificationItems) {
    return notFound();
  }

  return <CodesView version={versionResource} />;
}
