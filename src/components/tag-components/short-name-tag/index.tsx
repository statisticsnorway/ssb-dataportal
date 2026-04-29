import { Button, Tag, Tooltip } from '@digdir/designsystemet-react';
import { FilesIcon } from '@navikt/aksel-icons';
import { useClipboard } from '@/hooks/useClipboard';
import { localization } from '@/libs/language/src/localization';
import styles from './short-name-tag.module.css';

interface ShortNameTagProps {
  shortName: string;
}

const ShortNameTag = ({ shortName }: ShortNameTagProps) => {
  const { copied, copyToClipboard } = useClipboard();

  return (
    <Tag data-color='success' data-size='md' className={styles.shortNameText} aria-label={localization.shortName.label}>
      <div className={styles.shortNameWrapper}>
        <span className={styles.shortNameLabel}>{shortName}</span>
        <Tooltip content={copied ? localization.copy.copied : localization.copy.shortName}>
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

export { ShortNameTag };
