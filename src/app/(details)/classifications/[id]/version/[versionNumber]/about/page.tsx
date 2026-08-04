'use client';

import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import AboutView from '@/app/(details)/classifications/components/views/AboutView';

export default function AboutVersion() {
  const { versionResource, versionSummary } = useVersion();
  if (!versionResource) {
    return null;
  }

  return (
    <AboutView
      classification={versionResource}
      classificationSummary={versionSummary}
      classificationVersion={versionResource}
    />
  );
}
