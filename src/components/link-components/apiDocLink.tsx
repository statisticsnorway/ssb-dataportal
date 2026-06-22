'use client';

import { useAuthContext } from '@/app/authContext';
import { localization } from '@/libs/language';
import { ExternalLink } from './externalLink';

interface ApiDocLinkProps {
  href: string;
  className?: string;
  linkText?: string;
}

export const ApiDocLink = ({ href, className, linkText }: ApiDocLinkProps) => {
  const { isAuthenticated } = useAuthContext();
  const url = isAuthenticated ? `${href}?urls.primaryName=internal` : href;
  return <ExternalLink linkText={linkText ?? localization.apiDocumentation} href={url} className={className} />;
};
