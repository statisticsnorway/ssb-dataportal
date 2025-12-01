import { Card, Heading, Label, Paragraph } from '@digdir/designsystemet-react';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Field } from './field';
import { LinkField } from './link-field';

interface Props {
  data: CompleteResponse;
}

export const References = ({ data }: Props) => {
  return (
    <>
      <Card data-color='neutral' style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          {data.classificationReference ? (
            <Field label='Klassifikasjon' value={data.classificationReference} />
          ) : (
            <Paragraph data-size='sm'>—</Paragraph>
          )}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          {data.unitTypes && data.unitTypes.length > 0 ? (
            <Field label='Enhetstype' value={data.unitTypes.join(', ')} />
          ) : (
            <Paragraph data-size='sm'>—</Paragraph>
          )}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          {data.subjectFields && data.subjectFields.length > 0 ? (
            <Field label='Statistikkområde' value={data.subjectFields.join(', ')} />
          ) : (
            <Paragraph data-size='sm'>—</Paragraph>
          )}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          {data.externalReferenceUri ? (
            <LinkField label='External Reference URI' value={data.externalReferenceUri} />
          ) : (
            <Paragraph data-size='sm'>—</Paragraph>
          )}
        </div>
        <div>
          {data.relatedVariableDefinitionUris && data.relatedVariableDefinitionUris.length > 0 ? (
            <LinkField label='Related Variable URIs' value={data.relatedVariableDefinitionUris.join(', ')} />
          ) : (
            <Paragraph data-size='sm'>—</Paragraph>
          )}
        </div>
      </Card>

      <Card data-color='neutral'>
        <Field
          label='Inneholder personopplysninger'
          value={data.containsSpecialCategoriesOfPersonalData ? 'true' : 'false'}
        />
      </Card>
    </>
  );
};
