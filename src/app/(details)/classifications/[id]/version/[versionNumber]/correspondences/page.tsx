'use client';

import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import CorrespondencesView from '@/app/(details)/classifications/components/views/CorrespondencesView';

export default function Correspondences() {
  const { classification, versionResource, isLatest } = useVersion();

  if (!versionResource) {
    return null;
  }

  return <CorrespondencesView classificationId={classification.id!} version={versionResource} isLatest={isLatest} />;
}
