import { Tag, Tooltip } from '@digdir/designsystemet-react';
import { GlobeIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language/src/localization';

const LanguageTag = () => {
  return (
    <Tooltip content={localization.classification.language.contentChangelog}>
      <Tag data-size='lg' tabIndex={0}>
        <GlobeIcon aria-hidden='true' focusable='false' />
        {localization.classification.about.langNO}
      </Tag>
    </Tooltip>
  );
};

export default LanguageTag;
