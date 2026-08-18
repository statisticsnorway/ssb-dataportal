'use client';

import { Button, Dialog, Field, Label, Select } from '@digdir/designsystemet-react';
import { useState } from 'react';
import type { CodesDownloadFormat } from '@/libs/data/classifications/codesData';
import { localization, type SupportedLanguage, supportedLanguages } from '@/libs/language';
import { downloadCodesAction } from './actions';
import styles from './download-codes.module.css';

const FORMAT_OPTIONS = ['csv', 'xml', 'json'] as const satisfies ReadonlyArray<CodesDownloadFormat>;

function download(content: string, mimeType: string, fileName: string) {
  const blob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

interface DownloadCodesDialogProps {
  versionId: number;
  classificationId?: number;
  validFrom?: Date | string;
  validTo?: Date | string;
}

export function DownloadCodesDialog({
  versionId,
  classificationId,
  validFrom,
  validTo,
}: Readonly<DownloadCodesDialogProps>) {
  const defaultLanguage = localization.getLanguage() as SupportedLanguage;
  const languageLabels: Record<SupportedLanguage, string> = {
    nb: localization.classification.about.langNB,
    nn: localization.classification.about.langNN,
    en: localization.classification.about.langEN,
  };
  const [format, setFormat] = useState<CodesDownloadFormat>('csv');
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClose = () => {
    setFormat('csv');
    setLanguage(localization.getLanguage() as SupportedLanguage);
    setIsDownloading(false);
    setErrorMessage(null);
  };

  const handleDownload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsDownloading(true);

    if (!classificationId || !validFrom) {
      setErrorMessage(localization.classification.downloadCodes.error);
      setIsDownloading(false);
      return;
    }

    try {
      const payload = await downloadCodesAction({
        versionId,
        classificationId,
        validFrom: typeof validFrom === 'string' ? validFrom : validFrom.toISOString(),
        validTo: typeof validTo === 'string' ? validTo : validTo?.toISOString(),
        language,
        format,
      });
      download(payload.content, payload.mimeType, `classification-codes-${versionId}-${language}.${format}`);
    } catch {
      setErrorMessage(localization.classification.downloadCodes.error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger variant='secondary'>{localization.classification.downloadCodes.button}</Dialog.Trigger>
      <Dialog onClose={handleClose}>
        <form onSubmit={handleDownload} noValidate>
          <div className={styles.formFields}>
            <Field>
              <Label htmlFor='download-codes-format'>{localization.classification.downloadCodes.formatLabel}</Label>
              <Select
                id='download-codes-format'
                value={format}
                onChange={(event) => setFormat(event.target.value as CodesDownloadFormat)}
              >
                {FORMAT_OPTIONS.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item.toUpperCase()}
                  </Select.Option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label htmlFor='download-codes-language'>{localization.classification.downloadCodes.languageLabel}</Label>
              <Select
                id='download-codes-language'
                value={language}
                onChange={(event) => setLanguage(event.target.value as SupportedLanguage)}
              >
                {supportedLanguages.map((item) => (
                  <Select.Option key={item} value={item}>
                    {languageLabels[item]}
                  </Select.Option>
                ))}
              </Select>
            </Field>
            {errorMessage ? <p role='alert'>{errorMessage}</p> : null}
          </div>
          <Button type='submit' disabled={isDownloading}>
            {isDownloading
              ? localization.classification.downloadCodes.inProgress
              : localization.classification.downloadCodes.confirm}
          </Button>
        </form>
      </Dialog>
    </Dialog.TriggerContext>
  );
}
