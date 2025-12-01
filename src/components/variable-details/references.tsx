import { Paragraph } from '@digdir/designsystemet-react';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Field } from './field';
import { Section, InfoPanel } from './layout-components';

interface ReferencesProps {
  data: CompleteResponse;
}

const EmptyValue = () => <Paragraph data-size='sm'>—</Paragraph>;

export const References = ({ data }: ReferencesProps) => {
  const { 
    classificationReference, 
    unitTypes, 
    subjectFields, 
    externalReferenceUri, 
    relatedVariableDefinitionUris,
    containsSpecialCategoriesOfPersonalData
  } = data;

  return (
    <>
      <Section title="Variabelmetadata">
        <InfoPanel>
          <Field 
            label='Kodeverkets URI' 
            value={classificationReference || <EmptyValue />} 
          />
          <Field 
            label='Enhetstyper' 
            value={unitTypes?.length ? unitTypes.join(', ') : <EmptyValue />} 
          />
          <Field 
            label='Statistikkområder' 
            value={subjectFields?.length ? subjectFields.join(', ') : <EmptyValue />} 
          />
          <Field 
            label='URI til ekstern referanse' 
            value={externalReferenceUri ? 'Lenke' : <EmptyValue />}
            href={externalReferenceUri ?? undefined}
          />
          <Field 
            label='URI til relevante variabeldefinisjoner' 
            value={relatedVariableDefinitionUris?.length ? 'Lenke' : <EmptyValue />}
            href={relatedVariableDefinitionUris?.join(', ')}
          />
        </InfoPanel>
      </Section>

      <Section title="Personopplysninger">
        <InfoPanel>
          <Field
            label='Inneholder særlige kategorier av personopplysninger'
            value={containsSpecialCategoriesOfPersonalData ? 'Ja' : 'Nei'}
          />
        </InfoPanel>
      </Section>
    </>
  );
};
