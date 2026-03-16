import { Heading, HeadingProps, Link } from '@digdir/designsystemet-react';
import { JSX } from 'react';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import styles from './vardefHeading.module.css';

const withLink = ({ href, children }: { href: string; children: JSX.Element }) => {
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
  href,
  headingProps,
  variableDefinition,
}: {
  href?: string;
  headingProps: HeadingProps;
  variableDefinition: RenderedView;
}) => {
  const headingText = (
    <>
      <span className='heading12'>{variableDefinition.name}</span>
      <span className={styles.vardefShortName}>{variableDefinition.short_name}</span>
    </>
  );
  return href === undefined ? (
    <Heading {...headingProps}>{headingText}</Heading>
  ) : (
    <Heading className={styles.headingWithLink} {...headingProps}>
      {withLink({ href: href, children: headingText })}
    </Heading>
  );
};

export { VardefHeading };
