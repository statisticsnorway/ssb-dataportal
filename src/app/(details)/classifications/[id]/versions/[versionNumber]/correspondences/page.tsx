'use client';

import { notFound } from 'next/navigation';
import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import CorrespondencesView from '@/app/(details)/classifications/components/views/CorrespondencesView';

export default function Correspondences() {
  const { classification, versionResource } = useVersion();
  if (!versionResource || classification.id === undefined) {
    return notFound();
  }
  return <CorrespondencesView classificationId={classification.id} classificationVersion={versionResource} />;
}
