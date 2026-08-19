'use server';

import {
  type CodesDownloadFormat,
  fetchChangesDownload,
  fetchCodesDownload,
} from '@/libs/data/classifications/codesData';
import { fetchVariantCodesDownload } from '@/libs/data/classifications/variantsData';
import { ChangesLanguageEnum, CodesLanguageEnum } from '@/libs/data-access/klass';
import { VariantsLanguageEnum } from '@/libs/data-access/klass/apis/VariantsApi';
import { type SupportedLanguage } from '@/libs/language';

function toCodesLanguage(language: SupportedLanguage): CodesLanguageEnum {
  if (language === 'nn') return CodesLanguageEnum.NN;
  if (language === 'en') return CodesLanguageEnum.EN;
  return CodesLanguageEnum.NB;
}

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
  format: CodesDownloadFormat;
}) {
  return fetchCodesDownload({
    versionId,
    classificationId,
    from: new Date(validFrom),
    to: validTo ? new Date(validTo) : undefined,
    language: toCodesLanguage(language),
    format,
  });
}

function toVariantLanguage(language: SupportedLanguage): VariantsLanguageEnum {
  if (language === 'nn') return VariantsLanguageEnum.NN;
  if (language === 'en') return VariantsLanguageEnum.EN;
  return VariantsLanguageEnum.NB;
}

function toChangesLanguage(language: SupportedLanguage): ChangesLanguageEnum {
  if (language === 'nn') return ChangesLanguageEnum.NN;
  if (language === 'en') return ChangesLanguageEnum.EN;
  return ChangesLanguageEnum.NB;
}

export async function downloadVariantCodesAction({
  variantId,
  language,
  format,
}: {
  variantId: number;
  language: SupportedLanguage;
  format: CodesDownloadFormat;
}) {
  return fetchVariantCodesDownload({
    variantId,
    language: toVariantLanguage(language),
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
  format: CodesDownloadFormat;
}) {
  return fetchChangesDownload({
    classificationId,
    from: new Date(from),
    to: to ? new Date(to) : undefined,
    language: toChangesLanguage(language),
    format,
  });
}
