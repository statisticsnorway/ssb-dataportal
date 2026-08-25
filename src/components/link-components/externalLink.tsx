import { Link } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';

interface ExternalLinkProps {
  linkText: string;
  href: string;
  className?: string;
  willOpenNewTab?: boolean;
  ariaLabel?: string;
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
const ExternalLink = ({ linkText, href, ariaLabel, className, willOpenNewTab = false, ...rest }: ExternalLinkProps) => {
  return (
    <>
      {willOpenNewTab ? (
        <Link {...rest} target='_blank' rel='noreferrer' href={href} className={className} aria-label={ariaLabel}>
          {`${linkText} (${localization.opensInNewTab})`}
        </Link>
      ) : (
        <Link {...rest} rel='noreferrer' href={href} className={className} aria-label={ariaLabel}>
          {linkText}
        </Link>
      )}
    </>
  );
};

export { ExternalLink };
