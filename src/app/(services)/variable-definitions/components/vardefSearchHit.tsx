import { Card, Heading, Link, Paragraph, Tag } from '@digdir/designsystemet-react';
import { type ReactNode } from 'react';

import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { StatusTag } from '@/components/statusTag';
import { TagsGroup } from '@/components/tags-group';
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
      <Heading data-size='md' className={styles.vardefHeadingLink}>
        <HeadingLink href={vardefRoute}>
          <span className='heading12'>{variableDefinition.name}</span>
        </HeadingLink>
      </Heading>

      <Paragraph className={`${styles.truncateTo3Lines} ingress`}>{String(variableDefinition.definition)}</Paragraph>

      <div className={styles.tagsList}>
        <TagsGroup maxTags={4} tagData={subjectFieldTags} />
        {isAuthenticated && (
          <StatusTag aria-label={localization.status.label} variableStatus={variableDefinition.variable_status} />
        )}
        <Tag data-color='success' className={styles.shortName} aria-label={localization.shortName.label}>
          {variableDefinition.short_name}
        </Tag>
      </div>
    </Card>
  );
};

export { VardefSearchHit };
