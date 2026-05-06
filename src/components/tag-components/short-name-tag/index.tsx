import { Button, Tag, Tooltip } from '@digdir/designsystemet-react';
import { FilesIcon } from '@navikt/aksel-icons';
import { useClipboard } from '@/hooks/useClipboard';
import { localization } from '@/libs/language/src/localization';
import styles from './short-name-tag.module.css';

interface CopyTagProps {
  text: string;
  copyType?: CopyType;
}

export type CopyType = 'short_name' | 'id';

const CopyTag = ({ text: shortName, copyType = 'short_name' }: CopyTagProps) => {
  const { copied, copyToClipboard } = useClipboard();

  return (
    <Tag
      data-size='md'
      data-color='success'
      className={styles.shortNameText}
      aria-label={copyType === 'short_name' ? localization.shortName.label : localization.variableDefinition.id}
    >
      <div className={styles.shortNameWrapper}>
        <span className={styles.shortNameLabel}>{shortName}</span>
        <Tooltip
          content={
            copied
              ? localization.copy.copied
              : copyType === 'short_name'
                ? localization.copy.shortName
                : localization.copy.id
          }
        >
          <Button
            aria-label={copied ? localization.copy.copied : localization.copy.shortName}
            className={styles.copyShortNameButton}
            variant='tertiary'
            icon
            onClick={() => copyToClipboard(shortName)}
          >
            <FilesIcon aria-hidden />
          </Button>
        </Tooltip>
      </div>
    </Tag>
  );
};

export { CopyTag };
