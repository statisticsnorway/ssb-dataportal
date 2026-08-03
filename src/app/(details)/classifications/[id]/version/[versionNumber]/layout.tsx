import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { VersionResourceLayer } from '@/app/(details)/classifications/components/versionContext';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';

export default async function VersionLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ versionNumber: string }> }>) {
  const { versionNumber } = await params;
  const versionId = Number(versionNumber);
  if (Number.isNaN(versionId)) return notFound();

  const versionResource = await fetchVersionById(versionId).catch(() => null);
  if (!versionResource) return notFound();

  return <VersionResourceLayer versionResource={versionResource}>{children}</VersionResourceLayer>;
}
