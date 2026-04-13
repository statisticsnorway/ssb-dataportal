'use client';

import { AppNotFoundState } from '@/components/app-state';
import { localization } from '@/libs/language';

export default function NotFound() {
  return (
    <AppNotFoundState
      title={localization.error.notFoundTitleVariableDetails}
      message={localization.error.notFoundMessageVariableDetails}
      helpList={localization.error.notFoundHelpListVariableDetails}
      homeHref='/'
      secondaryHref='/variable-definitions'
      secondaryLabel={localization.variableDefinition.labelPlural}
      showBrokenLinkButton={false}
    />
  );
}
