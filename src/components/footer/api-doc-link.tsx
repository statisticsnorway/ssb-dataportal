'use client';

import { useAuthContext } from '@/app/authContext';
import { ExternalLink } from '@/components/external-link';
import { localization } from '@/libs/language';

interface ApiDocLinkProps {
  href: string;
  className?: string;
}

export const ApiDocLink = ({ href, className }: ApiDocLinkProps) => {
  const { isAuthenticated } = useAuthContext();
  const url = isAuthenticated ? `${href}?urls.primaryName=internal` : href;
  return <ExternalLink linkText={localization.apiDocumentation} href={url} className={className} />;
};
