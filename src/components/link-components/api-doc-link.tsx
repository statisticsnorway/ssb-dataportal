'use client';

import { ExternalLink } from '@/components/link-components/externalLink';
import { localization } from '@/libs/language';

export const ApiDocLink = ({ href }: { href: string }) => {
  return <ExternalLink linkText={localization.apiDocumentation} href={href} />;
};
