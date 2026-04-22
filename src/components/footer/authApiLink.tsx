'use client';

import { useAuthContext } from '@/app/authContext';
import { localization } from '@/libs/language';
import { ExternalLink } from '../link-components/externalLink';

interface ApiDocLinkProps {
  href: string;
}

export const ApiDocLink = ({ href }: ApiDocLinkProps) => {
  const { isAuthenticated } = useAuthContext();
  const url = isAuthenticated ? `${href}?urls.primaryName=internal` : href;
  return <ExternalLink linkText={localization.apiDocumentation} href={url} />;
};
