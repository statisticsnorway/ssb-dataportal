import { Tag, Tooltip } from '@digdir/designsystemet-react';
import { GlobeIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language/src/localization';

interface LanguageTagProps {
  tooltipContent?: string;
  title: string;
}

/**
 * LanguageTag component renders a tag with a globe icon and a tooltip indicating the language.
 */
const LanguageTag = ({ tooltipContent, title }: LanguageTagProps) => {
  return (
    <Tooltip content={tooltipContent ?? localization.classification.language.contentChangelog}>
      <Tag data-size='lg' tabIndex={0}>
        <GlobeIcon aria-hidden='true' focusable='false' />
        {title}
      </Tag>
    </Tooltip>
  );
};

export { LanguageTag };
