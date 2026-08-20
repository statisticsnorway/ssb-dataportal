'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useVersion } from '@/app/(details)/classifications/components/versionContext';
import { localization } from '@/libs/language';
import {
  buildDownloadQuery,
  getBasePathFromDownloadPath,
  getDownloadPath,
  parseDownloadConfig,
} from '../../utils/download-urls';
import { DownloadChangesDialog, DownloadCodesDialog } from './index';

type DownloadFormat = 'csv' | 'xml' | 'json';
type DownloadLanguage = 'nb' | 'nn' | 'en';

function buildSharePath(pathname: string, format: DownloadFormat, language: DownloadLanguage) {
  return `${getDownloadPath(getBasePathFromDownloadPath(pathname))}?${buildDownloadQuery({ format, language })}`;
}

function getDateBefore(date: Date): Date {
  const value = new Date(date);
  value.setDate(value.getDate() - 1);
  return value;
}

export function DownloadCodesRouteDialog() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { versionResource, classification } = useVersion();

  if (!versionResource?.id || !classification.id || !versionResource.validFrom) {
    return null;
  }

  const config = parseDownloadConfig(searchParams, localization.getLanguage() as 'nb' | 'nn' | 'en');
  const closePath = getBasePathFromDownloadPath(pathname);

  return (
    <DownloadCodesDialog
      versionId={versionResource.id}
      classificationId={classification.id}
      validFrom={versionResource.validFrom}
      validTo={versionResource.validTo}
      open={true}
      showTrigger={false}
      initialFormat={config.format}
      initialLanguage={config.language}
      onDialogClose={() => router.push(closePath)}
      buildShareUrl={({ language, format }) => buildSharePath(pathname, format, language)}
    />
  );
}

export function DownloadChangesRouteDialog() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { versionResource, classification } = useVersion();

  const sortedVersions =
    [...(classification.versions ?? [])].toSorted(
      (v1, v2) => (v2.validFrom?.getTime() ?? 0) - (v1.validFrom?.getTime() ?? 0),
    ) ?? [];
  const previousVersion = sortedVersions[sortedVersions.findIndex((v) => v.id === versionResource?.id) + 1];

  if (!versionResource?.id || !classification.id || !previousVersion?.validFrom) {
    return null;
  }

  const config = parseDownloadConfig(searchParams, localization.getLanguage() as 'nb' | 'nn' | 'en');
  const closePath = getBasePathFromDownloadPath(pathname);
  const from = getDateBefore(previousVersion.validFrom);

  return (
    <DownloadChangesDialog
      versionId={versionResource.id}
      classificationId={classification.id}
      from={from}
      to={versionResource.validTo}
      open={true}
      showTrigger={false}
      initialFormat={config.format}
      initialLanguage={config.language}
      onDialogClose={() => router.push(closePath)}
      buildShareUrl={({ language, format }) => buildSharePath(pathname, format, language)}
    />
  );
}

export function DownloadVariantCodesRouteDialog({ variantId }: Readonly<{ variantId: number }>) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const basePath = getBasePathFromDownloadPath(pathname);

  const config = parseDownloadConfig(searchParams, localization.getLanguage() as 'nb' | 'nn' | 'en');
  const closePath = basePath;

  return (
    <DownloadCodesDialog
      versionId={variantId}
      isVariantDownload={true}
      open={true}
      showTrigger={false}
      initialFormat={config.format}
      initialLanguage={config.language}
      onDialogClose={() => router.push(closePath)}
      buildShareUrl={({ language, format }) => buildSharePath(pathname, format, language)}
    />
  );
}
