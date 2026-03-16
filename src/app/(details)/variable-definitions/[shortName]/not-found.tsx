'use client';

import { AppNotFoundState } from '@/components/app-state';

export default function NotFound() {
  return (
    <AppNotFoundState
      title='Variabeldefinisjon ikke funnet'
      message='Er det skrivefeil i lenken? Eller har variabeldefinisjonen blitt slettet eller flyttet?'
      helpList={[
        'sjekke at du har riktig variabeldefinisjon-kortnavn i lenken',
        'gå til oversikten over variabeldefinisjoner',
        'gå til forsiden',
      ]}
      homeHref='/'
      secondaryHref='/variable-definitions'
      secondaryLabel='Variabeldefinisjoner'
      showBrokenLinkButton={false}
    />
  );
}
