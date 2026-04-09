'use client';

import { AppNotFoundState } from '@/components/app-state';
import { localization } from '@/libs/language';

export default function NotFound() {
  return (
    <AppNotFoundState
      message={localization.error.notFoundMessageVariableDetails}
      helpList={localization.error.notFoundHelpListVariableDetails}
      homeHref='/'
      secondaryHref='/variable-definitions'
      secondaryLabel='Variabeldefinisjoner'
      showBrokenLinkButton={false}
    />
  );
}
