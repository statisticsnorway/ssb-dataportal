'use client';

import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import AboutView from '@/app/(details)/classifications/components/views/AboutView';

export default function AboutVersion() {
  const { versionResource } = useVersion();
  if (!versionResource) {
    return null;
  }

  return <AboutView classification={versionResource} classificationVersion={versionResource} />;
}
