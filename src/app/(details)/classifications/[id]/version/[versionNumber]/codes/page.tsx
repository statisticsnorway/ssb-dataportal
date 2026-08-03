'use client';

import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import { CodesView } from '@/app/(details)/classifications/components/views/CodesView';

export default function CodesVersion() {
  const { versionResource } = useVersion();

  if (!versionResource?.classificationItems) {
    return null;
  }

  
  return <CodesView codes={versionResource.classificationItems} />;
}
