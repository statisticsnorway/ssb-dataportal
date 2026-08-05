'use client';

import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import AboutView from '@/app/(details)/classifications/components/views/AboutView';

export default function About() {
  const { classification, versionResource } = useVersion();
  if (!versionResource) {
    return null;
  }

  return <AboutView classification={classification} classificationVersion={versionResource} />;
}
