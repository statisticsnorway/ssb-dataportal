import { Button, Tag, Tooltip } from '@digdir/designsystemet-react';
import { FilesIcon } from '@navikt/aksel-icons';
import { useClipboard } from '@/hooks/useClipboard';
import { localization } from '@/libs/language/src/localization';
import { assertUnreachable } from '@/utils/functions';
import styles from './copy-tag.module.css';

interface CopyTagProps {
  text: string;
  copyType?: CopyType;
  size?: 'md' | 'lg';
}

type CopyType = 'short_name' | 'id' | 'file_path';

const localizeLabels = (copyType: CopyType): { copyLabel: string; tagLabel: string } => {
  switch (copyType) {
    case 'short_name':
      return {
        copyLabel: localization.copy.shortName,
        tagLabel: localization.variableDefinition.shortName,
      };
    case 'id':
      return {
        copyLabel: localization.copy.id,
        tagLabel: localization.variableDefinition.id,
      };
    case 'file_path':
      return {
        copyLabel: localization.copy.filePath,
        tagLabel: localization.dataCoverageTimeline.filePathLabel,
      };
    default:
      return assertUnreachable(copyType);
  }
};

const CopyTag = ({ text, copyType = 'short_name', size = 'md' }: CopyTagProps) => {
  const { copied, copyToClipboard } = useClipboard();
  const { copyLabel, tagLabel } = localizeLabels(copyType);
  return (
    <Tag data-size={size} data-color='magic' className={styles.copyText} aria-label={tagLabel}>
      <div className={styles.copyWrapper}>
        <span className={styles.copyLabel}>{copyType === 'file_path' ? copyLabel : text}</span>
        <Tooltip content={copied ? localization.copy.copied : copyLabel}>
          <Button
            aria-label={copied ? localization.copy.copied : copyLabel}
            className={styles.copyTextButton}
            variant='tertiary'
            icon
            onClick={() => copyToClipboard(text)}
          >
            <FilesIcon aria-hidden focusable='false' />
          </Button>
        </Tooltip>
      </div>
    </Tag>
  );
};

export { CopyTag };
