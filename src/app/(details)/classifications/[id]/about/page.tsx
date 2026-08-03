/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
'use client';

import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import AboutView from '@/app/(details)/classifications/components/views/AboutView';

export default function About() {
  const { classification, versionSummary, versionResource } = useVersion();

  console.log('Klassifikasjon', classification);
  console.log('Versjonssammendrag', versionSummary);
  console.log('Versjon', versionResource);
  if (!versionResource) {
    return null;
  }

  return (
    <AboutView
      classification={classification}
      classificationSummary={versionSummary}
      classificationVersion={versionResource}
    />
  );
}
