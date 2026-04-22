import { Tag } from '@digdir/designsystemet-react';
import { FilesIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language/src/localization';

interface ShortNameTagProps {
  className?: string;
  shortName: string;
  copy?: boolean;
}

const ShortNameTag = ({ className, shortName, copy = true }: ShortNameTagProps) => {
  return copy ? (
    <Tag data-size='lg' data-color='success' className={className} aria-label={localization.shortName.label}>
      <span style={{ display: 'flex', gap: '1rem' }}>
        {shortName}
        <FilesIcon focusable={true} />
      </span>
    </Tag>
  ) : (
    <Tag data-size='lg' data-color='success' className={className} aria-label={localization.shortName.label}>
      {shortName}
    </Tag>
  );
};

export { ShortNameTag };
