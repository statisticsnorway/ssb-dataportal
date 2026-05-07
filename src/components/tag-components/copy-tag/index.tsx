import { Button, Tag, Tooltip } from '@digdir/designsystemet-react';
import { FilesIcon } from '@navikt/aksel-icons';
import { useClipboard } from '@/hooks/useClipboard';
import { localization } from '@/libs/language/src/localization';
import styles from './copy-tag.module.css';

interface CopyTagProps {
  text: string;
  copyType?: CopyType;
}

export type CopyType = 'short_name' | 'id';

const CopyTag = ({ text, copyType = 'short_name' }: CopyTagProps) => {
  const { copied, copyToClipboard } = useClipboard();
  const copyLabel = copyType === 'short_name' ? localization.copy.shortName : localization.copy.id;
  return (
    <Tag
      data-size='md'
      data-color={copyType == 'short_name' ? 'success' : 'neutral'}
      className={styles.copyText}
      aria-label={copyType === 'short_name' ? localization.shortName.label : localization.variableDefinition.id}
    >
      <div className={styles.copyWrapper}>
        <span className={styles.copyLabel}>{text}</span>
        <Tooltip content={copied ? localization.copy.copied : copyLabel}>
          <Button
            aria-label={copied ? localization.copy.copied : copyLabel}
            className={styles.copyTextButton}
            variant='tertiary'
            icon
            onClick={() => copyToClipboard(text)}
          >
            <FilesIcon aria-hidden />
          </Button>
        </Tooltip>
      </div>
    </Tag>
  );
};

export { CopyTag };
