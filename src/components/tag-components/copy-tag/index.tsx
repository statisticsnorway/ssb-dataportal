import { Button, Tag, Tooltip } from '@digdir/designsystemet-react';
import { FilesIcon } from '@navikt/aksel-icons';
import { useClipboard } from '@/hooks/useClipboard';
import { localization } from '@/libs/language/src/localization';
import { assertUnreachable } from '@/utils/functions';
import styles from './copy-tag.module.css';

interface CopyTagProps {
  text: string;
  copyType?: CopyType;
}

type CopyType = 'short_name' | 'id' | 'file_path';

const localizeCopyTypeLabel = (it: CopyType): string => {
  switch (it) {
    case 'short_name':
      return localization.copy.shortName;
    case 'id':
      return localization.copy.id;
    case 'file_path':
      return localization.copy.filePath;
    default:
      return assertUnreachable(it);
  }
};

const CopyTag = ({ text, copyType = 'short_name' }: CopyTagProps) => {
  const { copied, copyToClipboard } = useClipboard();
  const copyLabel = localizeCopyTypeLabel(copyType);
  return (
    <Tag
      data-size='md'
      data-color={copyType == 'short_name' ? 'success' : 'neutral'}
      className={styles.copyText}
      aria-label={
        copyType === 'short_name' ? localization.variableDefinition.shortName : localization.variableDefinition.id
      }
    >
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
