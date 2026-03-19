'use client';

import { usePathname } from 'next/navigation';
import { localization } from '@/libs/language';
import { AppState, AppStateAction } from './app-state';

type AppNotFoundStateProps = Readonly<{
  title?: string;
  message?: string;
  statusCode?: string;
  helpList?: readonly string[];
  homeHref?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  showBrokenLinkButton?: boolean;
}>;

export function AppNotFoundState({
  title = 'Siden finnes ikke',
  message = 'Siden kan være flyttet, slettet eller lenken kan være feil.',
  statusCode = '404',
  helpList,
  homeHref = '/',
  secondaryHref,
  secondaryLabel,
  showBrokenLinkButton = true,
}: AppNotFoundStateProps) {
  const path = usePathname();
  const body = encodeURIComponent(localization.error.brokenLinkMailBody(path));
  const subject = encodeURIComponent(localization.error.brokenLinkMailSubject);
  const mailto = `mailto:metadata@ssb.no?subject=${subject}&body=${body}`;

  const actions: AppStateAction[] = [
    {
      kind: 'link',
      label: 'Gå til forsiden',
      href: homeHref,
      variant: 'primary',
    },
  ];

  if (secondaryHref && secondaryLabel) {
    actions.push({
      kind: 'link',
      label: secondaryLabel,
      href: secondaryHref,
      variant: 'secondary',
    });
  } else if (showBrokenLinkButton) {
    actions.push({
      kind: 'link',
      label: 'Meld fra om ødelagt lenke',
      href: mailto,
      variant: 'secondary',
      external: true,
    });
  }

  return (
    <AppState
      title={title}
      message={message}
      titleId='app-not-found-title'
      statusCode={statusCode}
      helpTitle={helpList && helpList.length > 0 ? 'Du kan prøve å:' : undefined}
      helpList={helpList}
      actions={actions}
    />
  );
}
