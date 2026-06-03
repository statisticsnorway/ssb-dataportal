import { Card, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { type ReactNode } from 'react';

import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { CopyTag } from '@/components/tag-components/copy-tag';
import { StatusTag } from '@/components/tag-components/statusTag';
import { TagsGroup } from '@/components/tag-components/tags-group';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import { areFieldsDefinedAndNonNull, getLabelWithParent } from '@/utils/functions';
import { useVariableDefinitionsContext } from '../variable-definitions-service-page/components/variableDefinitionContext';
import styles from './vardef.module.css';

interface VardefSearchHitProps {
  variableDefinition: RenderedView;
}

interface HeadingLinkProps {
  href: string;
  children: ReactNode;
}

const HeadingLink = ({ href, children }: HeadingLinkProps) => (
  <Link href={href} className={styles.vardefHeadingLink}>
    {children}
  </Link>
);

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  const { subjectFilters } = useVariableDefinitionsContext();
  const { isAuthenticated } = useAuthContext();

  const subjectFieldTags = new Map(
    variableDefinition.subject_fields
      .filter((ref) => areFieldsDefinedAndNonNull(ref, ['code', 'title']))
      .map((field) => [field.code, getLabelWithParent(field, subjectFilters)]),
  );

  const vardefRoute = `${tabsData.VariableDefinitions.route}/${variableDefinition.short_name}`;

  return (
    <Card data-testid='vardef-search-card'>
      <Heading data-size='md' className={styles.vardefHeadingLink} level={2}>
        <HeadingLink href={vardefRoute}>
          <span className='secondaryHeading'>{variableDefinition.name}</span>
        </HeadingLink>
      </Heading>

      <Paragraph className={`${styles.truncateTo3Lines} ingress`}>{String(variableDefinition.definition)}</Paragraph>

      <div className={styles.tagsList}>
        <TagsGroup maxTags={4} tagData={subjectFieldTags} ariaLabel={localization.subjectArea} />
        {isAuthenticated && <StatusTag variableStatus={variableDefinition.variable_status} />}
        <CopyTag text={variableDefinition.short_name} />
      </div>
    </Card>
  );
};

export { VardefSearchHit };
