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
  title,
  message,
  statusCode = '404',
  helpList,
  homeHref = '/',
  secondaryHref,
  secondaryLabel,
  showBrokenLinkButton = true,
}: AppNotFoundStateProps) {
  const { error: errorText } = localization;
  const path = usePathname();
  const body = encodeURIComponent(localization.error.brokenLinkMailBody(path));
  const subject = encodeURIComponent(localization.error.brokenLinkMailSubject);
  const mailto = `mailto:metadata@ssb.no?subject=${subject}&body=${body}`;
  const resolvedTitle = title ?? errorText.notFoundTitle;
  const resolvedMessage = message ?? errorText.notFoundMessage;

  const actions: AppStateAction[] = [
    {
      kind: 'link',
      label: errorText.goHome,
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
      label: errorText.reportBrokenLink,
      href: mailto,
      variant: 'secondary',
      external: true,
    });
  }

  return (
    <AppState
      title={resolvedTitle}
      message={resolvedMessage}
      titleId='app-not-found-title'
      statusCode={statusCode}
      helpTitle={helpList && helpList.length > 0 ? errorText.helpTitle : undefined}
      helpList={helpList}
      actions={actions}
    />
  );
}
