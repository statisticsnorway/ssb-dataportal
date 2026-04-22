import { Card, Heading, Link, Paragraph, Tag } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { StatusTag } from '@/components/statusTag';
import { TagsGroup } from '@/components/tags-group';
import { tagsList } from '@/components/tags-group/tags-group.module.css';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { areFieldsDefinedAndNonNull, getLabelWithParent } from '@/utils/functions';
import { useVariableDefinitionsContext } from '../variable-definitions-service-page/components/variableDefinitionContext';
import styles from './vardef.module.css';

interface VardefSearchHitProps {
  variableDefinition: RenderedView;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  const { subjectFilters } = useVariableDefinitionsContext();
  const { isAuthenticated } = useAuthContext();
  return (
    <Card data-testid='vardef-search-card'>
      <Heading data-size='md' className={styles.headingWithLink}>
        {withLink({
          href: `${tabsData.VariableDefinitions.route}/${variableDefinition.short_name}`,
          children: variableDefinition.name,
        })}
      </Heading>

      {/* <VardefHeading
        href={`${tabsData.VariableDefinitions.route}/${variableDefinition.short_name}`}
        headingProps={{ 'data-size': 'md', level: 2 }}
        variableDefinition={variableDefinition}
      ></VardefHeading> */}
      <Paragraph className={`${styles.truncateTo3Lines} ingress`}>{String(variableDefinition.definition)}</Paragraph>
      <div className={tagsList}>
        <TagsGroup
          maxTags={4}
          tagData={
            new Map(
              variableDefinition.subject_fields
                .filter((ref) => areFieldsDefinedAndNonNull(ref, ['code', 'title']))
                .map((field) => [field.code, getLabelWithParent(field, subjectFilters)]),
            )
          }
        />
        {isAuthenticated ? <StatusTag variableStatus={variableDefinition.variable_status} /> : null}
        <Tag data-color='success'>{variableDefinition.short_name}</Tag>
      </div>
    </Card>
  );
};

export { VardefSearchHit };

import { ReactNode } from 'react';

const withLink = ({ href, children }: { href: string; children: ReactNode }) => {
  return (
    <Link href={href} className={styles.vardefHeadingLink}>
      {children}
    </Link>
  );
};
