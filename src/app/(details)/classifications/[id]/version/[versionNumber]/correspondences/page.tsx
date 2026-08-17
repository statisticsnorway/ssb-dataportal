'use client';

import { notFound } from 'next/navigation';
import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import CorrespondencesView from '@/app/(details)/classifications/components/views/CorrespondencesView';

export default function Correspondences() {
  const { versionResource } = useVersion();
  if (!versionResource) {
    return notFound();
  }
  return <CorrespondencesView classificationVersion={versionResource} />;
}
