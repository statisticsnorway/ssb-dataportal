'use client';

import { Button, Dialog, Field, Label, Select } from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';
import type { FileDownloadFormat } from '@/libs/data/classifications/codesData';
import { localization, type SupportedLanguage, supportedLanguages } from '@/libs/language';
import {
  downloadChangesAction,
  downloadCodesAction,
  downloadCorrespondenceAction,
  downloadVariantCodesAction,
} from './actions';
import styles from './download-dialog.module.css';
import { createDownloadBlob } from './download-utils';

const FORMAT_OPTIONS = ['csv', 'xml', 'json'] as const satisfies ReadonlyArray<FileDownloadFormat>;

function download(content: string, mimeType: string, fileName: string) {
  const blob = createDownloadBlob(content, mimeType, fileName);
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
  open?: boolean;
  showTrigger?: boolean;
  initialFormat?: FileDownloadFormat;
  initialLanguage?: SupportedLanguage;
  onDialogClose?: () => void;
  buildShareUrl?: (args: { language: SupportedLanguage; format: FileDownloadFormat }) => string;
}

interface DownloadChangesDialogProps {
  versionId: number;
  classificationId: number;
  from: Date | string;
  to?: Date | string;
  open?: boolean;
  showTrigger?: boolean;
  initialFormat?: FileDownloadFormat;
  initialLanguage?: SupportedLanguage;
  onDialogClose?: () => void;
  buildShareUrl?: (args: { language: SupportedLanguage; format: FileDownloadFormat }) => string;
}

interface DownloadCorrespondenceDialogProps {
  tableId: number;
  open?: boolean;
  showTrigger?: boolean;
  initialFormat?: FileDownloadFormat;
  initialLanguage?: SupportedLanguage;
  onDialogClose?: () => void;
  buildShareUrl?: (args: { language: SupportedLanguage; format: FileDownloadFormat }) => string;
}

interface DownloadDialogBaseProps {
  versionId: number;
  filePrefixByLanguage: Record<SupportedLanguage, string>;
  title: {
    button: string;
    formatLabel: string;
    languageLabel: string;
    confirm: string;
    inProgress: string;
    error: string;
    copyLink: string;
    linkCopied: string;
  };
  handleAction: (args: {
    language: SupportedLanguage;
    format: FileDownloadFormat;
  }) => Promise<{ content: string; mimeType: string }>;
  open?: boolean;
  showTrigger?: boolean;
  initialFormat?: FileDownloadFormat;
  initialLanguage?: SupportedLanguage;
  onDialogClose?: () => void;
  buildShareUrl?: (args: { language: SupportedLanguage; format: FileDownloadFormat }) => string;
}

function DownloadDialog({
  versionId,
  filePrefixByLanguage,
  title,
  handleAction,
  open,
  showTrigger = true,
  initialFormat,
  initialLanguage,
  onDialogClose,
  buildShareUrl,
}: Readonly<DownloadDialogBaseProps>) {
  const defaultLanguage = initialLanguage ?? (localization.getLanguage() as SupportedLanguage);
  const defaultFormat = initialFormat ?? 'csv';
  const languageLabels: Record<SupportedLanguage, string> = {
    nb: localization.classification.about.langNB,
    nn: localization.classification.about.langNN,
    en: localization.classification.about.langEN,
  };
  const [format, setFormat] = useState<FileDownloadFormat>(defaultFormat);
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormat(defaultFormat);
  }, [defaultFormat]);

  useEffect(() => {
    setLanguage(defaultLanguage);
  }, [defaultLanguage]);

  const sharePath = buildShareUrl?.({ language, format }) ?? null;

  useEffect(() => {
    if (!sharePath) {
      return;
    }

    const currentPathWithQuery = `${window.location.pathname}${window.location.search}`;
    if (currentPathWithQuery === sharePath) {
      return;
    }

    window.history.replaceState(window.history.state, '', sharePath);
  }, [sharePath]);

  const handleClose = () => {
    setFormat(defaultFormat);
    setLanguage(defaultLanguage);
    setIsDownloading(false);
    setErrorMessage(null);
    setCopyMessage(null);
    onDialogClose?.();
  };

  const handleCopyLink = async () => {
    if (!sharePath) {
      return;
    }

    setCopyMessage(null);
    setErrorMessage(null);

    try {
      await navigator.clipboard.writeText(new URL(sharePath, window.location.origin).toString());
      setCopyMessage(title.linkCopied);
    } catch {
      setErrorMessage(title.error);
    }
  };

  const handleDownload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsDownloading(true);

    try {
      const payload = await handleAction({ language, format });
      const filePrefix = filePrefixByLanguage[language];
      download(payload.content, payload.mimeType, `${filePrefix}-${versionId}-${language}.${format}`);
    } catch {
      setErrorMessage(title.error);
    } finally {
      setIsDownloading(false);
    }
  };

  const content = (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleDownload} noValidate>
        <div className={styles.formFields}>
          <Field>
            <Label htmlFor='download-format'>{title.formatLabel}</Label>
            <Select
              id='download-format'
              value={format}
              onChange={(event) => setFormat(event.target.value as FileDownloadFormat)}
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
          {copyMessage ? <output>{copyMessage}</output> : null}
        </div>
        <div className={styles.actions}>
          {sharePath ? (
            <Button type='button' variant='secondary' onClick={handleCopyLink}>
              {title.copyLink}
            </Button>
          ) : null}
          <Button type='submit' disabled={isDownloading}>
            {isDownloading ? title.inProgress : title.confirm}
          </Button>
        </div>
      </form>
    </Dialog>
  );

  if (!showTrigger) {
    return content;
  }

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger variant='secondary'>{title.button}</Dialog.Trigger>
      {content}
    </Dialog.TriggerContext>
  );
}

export function DownloadCodesDialog({
  versionId,
  classificationId,
  validFrom,
  validTo,
  isVariantDownload,
  open,
  showTrigger,
  initialFormat,
  initialLanguage,
  onDialogClose,
  buildShareUrl,
}: Readonly<DownloadCodesDialogProps>) {
  const filePrefixByLanguage = isVariantDownload
    ? {
        nb: 'klassifikasjon-variant-koder',
        nn: 'klassifikasjon-variant-kodar',
        en: 'classification-variant-codes',
      }
    : {
        nb: 'klassifikasjon-koder',
        nn: 'klassifikasjon-kodar',
        en: 'classification-codes',
      };

  return (
    <DownloadDialog
      versionId={versionId}
      filePrefixByLanguage={filePrefixByLanguage}
      title={localization.classification.download}
      open={open}
      showTrigger={showTrigger}
      initialFormat={initialFormat}
      initialLanguage={initialLanguage}
      onDialogClose={onDialogClose}
      buildShareUrl={buildShareUrl}
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

export function DownloadChangesDialog({
  versionId,
  classificationId,
  from,
  to,
  open,
  showTrigger,
  initialFormat,
  initialLanguage,
  onDialogClose,
  buildShareUrl,
}: Readonly<DownloadChangesDialogProps>) {
  return (
    <DownloadDialog
      versionId={versionId}
      filePrefixByLanguage={{
        nb: 'klassifikasjon-endringer',
        nn: 'klassifikasjon-endringar',
        en: 'classification-changes',
      }}
      title={localization.classification.download}
      open={open}
      showTrigger={showTrigger}
      initialFormat={initialFormat}
      initialLanguage={initialLanguage}
      onDialogClose={onDialogClose}
      buildShareUrl={buildShareUrl}
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

export function DownloadCorrespondenceDialog({
  tableId,
  open,
  showTrigger,
  initialFormat,
  initialLanguage,
  onDialogClose,
  buildShareUrl,
}: Readonly<DownloadCorrespondenceDialogProps>) {
  return (
    <DownloadDialog
      versionId={tableId}
      filePrefixByLanguage={{
        nb: 'klassifikasjon-korrespondansetabell',
        nn: 'klassifikasjon-korrespondansetabell',
        en: 'classification-correspondence-table',
      }}
      title={localization.classification.download}
      open={open}
      showTrigger={showTrigger}
      initialFormat={initialFormat}
      initialLanguage={initialLanguage}
      onDialogClose={onDialogClose}
      buildShareUrl={buildShareUrl}
      handleAction={({ language, format }) =>
        downloadCorrespondenceAction({
          tableId,
          language,
          format,
        })
      }
    />
  );
}
