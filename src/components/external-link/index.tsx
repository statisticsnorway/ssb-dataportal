import { Link } from '@digdir/designsystemet-react';

interface ExternalLinkProps {
  linkText: string;
  href: string;
  className?: string;
}

/**
 * Renders a Designsystem `Link` that opens an external URL in a safe way.
 * Adds `rel="noreferrer"` to prevent passing referrer information.
 *
 * @param href - The URL to navigate to.
 * @param linkText - Text to display for the link.
 * @returns A `Link` component rendering the given text and URL.
 */
const ExternalLink = ({ linkText, href, className }: ExternalLinkProps) => {
  return (
    <Link rel='noreferrer' href={href} className={className}>
      {linkText}
    </Link>
  );
};

export { ExternalLink };
