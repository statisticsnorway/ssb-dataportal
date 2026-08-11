'use client';

import { notFound } from 'next/navigation';
import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import VariantsView from '@/app/(details)/classifications/components/views/VariantsView';

export default function Variants() {
  const { classification, versionResource } = useVersion();
  if (!versionResource?.classificationVariants) {
    return notFound();
  }
  return <VariantsView classificationVersion={versionResource} classificationId={classification.id!} />;
}
