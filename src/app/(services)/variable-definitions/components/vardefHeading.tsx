import { Heading, HeadingProps } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { JSX } from 'react';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import styles from './vardef.module.css';

const withLink = ({ href, children }: { href: string | object; children: JSX.Element }) => {
  return (
    <Link href={href} className={styles.vardefHeadingLink}>
      {children}
    </Link>
  );
};

/**
 * A heading with both the display name of the variable definition, and the shortName inline
 * in monospaced text to indicate its technical nature.
 *
 * @param href - optionally make the heading into a link
 * @param headingProps - props to pass through to the Heading component from @digdir/designsystemet-react
 * @param variableDefinition - the resource to create a heading for
 * @returns
 */
const VardefHeading = ({
  href = undefined,
  headingProps,
  variableDefinition,
}: {
  href?: string | object | undefined;
  headingProps: HeadingProps;
  variableDefinition: RenderedView;
}) => {
  const headingText = (
    <>
      {variableDefinition.name}
      <span className={styles.vardefShortName}>{variableDefinition.shortName}</span>
    </>
  );
  return href === undefined ? (
    <Heading {...headingProps}>{headingText}</Heading>
  ) : (
    <Heading {...headingProps}>{withLink({ href: href, children: headingText })}</Heading>
  );
};

export { VardefHeading };
