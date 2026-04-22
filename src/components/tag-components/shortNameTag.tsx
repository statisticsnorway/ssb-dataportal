import { Tag, Tooltip } from '@digdir/designsystemet-react';
import { FilesIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language/src/localization';

interface ShortNameTagProps {
  className?: string;
  shortName: string;
  copy?: boolean;
  copied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
}

const ShortNameTag = ({ className, shortName, copy = true, copied, copyToClipboard }: ShortNameTagProps) => {
  return copy ? (
    <Tag data-size='lg' data-color='success' className={className} aria-label={localization.shortName.label}>
      <span style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {shortName}
        <Tooltip content={copied ? localization.copy.copied : localization.copy.shortName}>
          <span
            role='button'
            tabIndex={0}
            aria-label={copied ? localization.copy.copied : localization.copy.shortName}
            onClick={() => copyToClipboard(shortName)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyToClipboard(shortName);
              }
            }}
          >
            <FilesIcon aria-hidden />
          </span>
        </Tooltip>
      </span>
    </Tag>
  ) : (
    <Tag data-size='lg' data-color='success' className={className} aria-label={localization.shortName.label}>
      {shortName}
    </Tag>
  );
};

export { ShortNameTag };
