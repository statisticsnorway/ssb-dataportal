'use server';

import { type CodesDownloadFormat, fetchCodesDownload } from '@/libs/data/classifications/codesData';
import { fetchVariantCodesDownload } from '@/libs/data/classifications/variantsData';
import { CodesLanguageEnum } from '@/libs/data-access/klass';
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
