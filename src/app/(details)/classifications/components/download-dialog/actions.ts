'use server';

import {
  type FileDownloadFormat,
  fetchChangesDownload,
  fetchCodesDownload,
} from '@/libs/data/classifications/codesData';
import { fetchCorrespondenceDownload } from '@/libs/data/classifications/correspondencesData';
import { fetchVariantCodesDownload } from '@/libs/data/classifications/variantsData';
import { type SupportedLanguage } from '@/libs/language';

export async function downloadCodesAction({
  versionId,
  classificationId,
  validFrom,
  validTo,
  language,
  format,
}: {
  versionId: number;
  classificationId: number;
  validFrom: string;
  validTo?: string;
  language: SupportedLanguage;
  format: FileDownloadFormat;
}) {
  return fetchCodesDownload({
    versionId,
    classificationId,
    from: new Date(validFrom),
    to: validTo ? new Date(validTo) : undefined,
    language,
    format,
  });
}

export async function downloadVariantCodesAction({
  variantId,
  language,
  format,
}: {
  variantId: number;
  language: SupportedLanguage;
  format: FileDownloadFormat;
}) {
  return fetchVariantCodesDownload({
    variantId,
    language,
    format,
  });
}

export async function downloadChangesAction({
  classificationId,
  from,
  to,
  language,
  format,
}: {
  classificationId: number;
  from: string;
  to?: string;
  language: SupportedLanguage;
  format: FileDownloadFormat;
}) {
  return fetchChangesDownload({
    classificationId,
    from: new Date(from),
    to: to ? new Date(to) : undefined,
    language,
    format,
  });
}

export async function downloadCorrespondenceAction({
  tableId,
  language,
  format,
}: {
  tableId: number;
  language: SupportedLanguage;
  format: FileDownloadFormat;
}) {
  return fetchCorrespondenceDownload({
    tableId,
    language,
    format,
  });
}
