/* Message is specific for this */

import { Tag, Tooltip } from '@digdir/designsystemet-react';
import { GlobeIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language/src/localization';

const LanguageTag = () => {
  return (
    <Tooltip content={localization.classification.language.notSelectedLanguage}>
      <Tag data-size='lg' tabIndex={0}>
        <GlobeIcon aria-hidden='true' focusable='false' />
        {'Norwegian'} {/* localization Norsk */}
      </Tag>
    </Tooltip>
  );
};

export default LanguageTag;
