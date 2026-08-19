'use client';

import { Button, Dialog, Field, Label, Select } from '@digdir/designsystemet-react';
import { useState } from 'react';
import type { CodesDownloadFormat } from '@/libs/data/classifications/codesData';
import { localization, type SupportedLanguage, supportedLanguages } from '@/libs/language';
import { downloadChangesAction, downloadCodesAction, downloadVariantCodesAction } from './actions';
import styles from './download-dialog.module.css';

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
  isVariantDownload?: boolean;
}

interface DownloadChangesDialogProps {
  versionId: number;
  classificationId: number;
  from: Date | string;
  to?: Date | string;
}

interface DownloadDialogBaseProps {
  versionId: number;
  filePrefix: string;
  title: {
    button: string;
    formatLabel: string;
    languageLabel: string;
    confirm: string;
    inProgress: string;
    error: string;
  };
  handleAction: (args: {
    language: SupportedLanguage;
    format: CodesDownloadFormat;
  }) => Promise<{ content: string; mimeType: string }>;
}

function DownloadDialog({ versionId, filePrefix, title, handleAction }: Readonly<DownloadDialogBaseProps>) {
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

    try {
      const payload = await handleAction({ language, format });
      download(payload.content, payload.mimeType, `${filePrefix}-${versionId}-${language}.${format}`);
    } catch {
      setErrorMessage(title.error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger variant='secondary'>{title.button}</Dialog.Trigger>
      <Dialog onClose={handleClose}>
        <form onSubmit={handleDownload} noValidate>
          <div className={styles.formFields}>
            <Field>
              <Label htmlFor='download-format'>{title.formatLabel}</Label>
              <Select
                id='download-format'
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
              <Label htmlFor='download-language'>{title.languageLabel}</Label>
              <Select
                id='download-language'
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
            {isDownloading ? title.inProgress : title.confirm}
          </Button>
        </form>
      </Dialog>
    </Dialog.TriggerContext>
  );
}

export function DownloadCodesDialog({
  versionId,
  classificationId,
  validFrom,
  validTo,
  isVariantDownload,
}: Readonly<DownloadCodesDialogProps>) {
  return (
    <DownloadDialog
      versionId={versionId}
      filePrefix={isVariantDownload ? 'classification-variant-codes' : 'classification-codes'}
      title={localization.classification.download}
      handleAction={({ language, format }) => {
        if (isVariantDownload) {
          return downloadVariantCodesAction({
            variantId: versionId,
            language,
            format,
          });
        }

        if (!classificationId || !validFrom) {
          throw new Error('Missing classification download parameters');
        }

        return downloadCodesAction({
          versionId,
          classificationId,
          validFrom: typeof validFrom === 'string' ? validFrom : validFrom.toISOString(),
          validTo: typeof validTo === 'string' ? validTo : validTo?.toISOString(),
          language,
          format,
        });
      }}
    />
  );
}

export function DownloadChangesDialog({ versionId, classificationId, from, to }: Readonly<DownloadChangesDialogProps>) {
  return (
    <DownloadDialog
      versionId={versionId}
      filePrefix='classification-changes'
      title={localization.classification.download}
      handleAction={({ language, format }) =>
        downloadChangesAction({
          classificationId,
          from: typeof from === 'string' ? from : from.toISOString(),
          to: typeof to === 'string' ? to : to?.toISOString(),
          language,
          format,
        })
      }
    />
  );
}
