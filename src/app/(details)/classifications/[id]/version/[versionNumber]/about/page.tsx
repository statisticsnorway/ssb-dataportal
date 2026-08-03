/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
'use client';

import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import AboutView from '@/app/(details)/classifications/components/views/AboutView';

export default function AboutVersion() {
  const {classification, versionResource, versionSummary } = useVersion();
  if(!versionResource){
    return null
  }
  console.log('Klassifikasjon', classification);
  console.log('Versjon', versionResource);
  console.log('Versjonssammendrag', versionSummary);

  return <AboutView classification={versionResource} classificationSummary={versionSummary} classificationVersion={versionResource} />;
}
