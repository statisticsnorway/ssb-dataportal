import { Card, Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { TagsGroup } from '@/components/tags-group';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal';
import {SUBJECT_FIELD_LOOKUP} from "@/libs/data/subjectFieldLookup";

interface VardefSearchHitProps {
  variableDefinition: CompleteResponse;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
    <Card>
      <Heading data-size='xl' level={1}>
        <Link href={`/variable-definitions/${variableDefinition.id}`} rel='noopener noreferrer' className="vardef-search-hit__heading-link">
          <span className="vardef-search-hit__name">
              {variableDefinition.name.nb}
          </span>
            {variableDefinition.shortName && (
            <span className="vardef-search-hit__short-name">
                {variableDefinition.shortName}
            </span>
            )}
        </Link>
      </Heading>
      <Paragraph className='clamp'>{variableDefinition.definition.nb}</Paragraph>
      <TagsGroup
        maxTags={4}
        tagsData={
          new Set(
            (variableDefinition.subjectFields ?? []).map((field) => ({
              key: field,
              title: SUBJECT_FIELD_LOOKUP[field] ?? field,
            })),
          )
        }
      />
    </Card>
  );
};

export { VardefSearchHit };
