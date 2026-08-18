'use server';

import { type CodesDownloadFormat, fetchCodesDownload } from '@/libs/data/classifications/codesData';
import { CodesLanguageEnum } from '@/libs/data-access/klass';
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
