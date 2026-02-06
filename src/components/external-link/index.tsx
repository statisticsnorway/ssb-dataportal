import { Link } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';

interface ExternalLinkProps {
  linkText: string;
  href: string;
  className?: string;
  willOpenNewTab?: boolean;
}

/**
 * Renders a Designsystem `Link` that opens an external URL in a safe way.
 * Adds `rel="noreferrer"` to prevent passing referrer information.
 *
 * @param href - The URL to navigate to.
 * @param linkText - Text to display for the link.
 * @param willOpenNewTab - When true, adds `target="_blank"` and appends text indicating the link opens in a new tab.
 * @returns A `Link` component rendering the given text and URL.
 */
const ExternalLink = ({ linkText, href, className, willOpenNewTab = false }: ExternalLinkProps) => {
  return (
    <>
      {willOpenNewTab ? (
        <Link target='_blank' rel='noreferrer' href={href} className={className}>
          {`${linkText} (${localization.opensInNewTab})`}
        </Link>
      ) : (
        <Link rel='noreferrer' href={href} className={className}>
          {linkText}
        </Link>
      )}
    </>
  );
};

export { ExternalLink };
