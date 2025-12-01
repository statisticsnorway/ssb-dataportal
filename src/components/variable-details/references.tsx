import { Paragraph } from '@digdir/designsystemet-react';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Field } from './field';
import { InfoPanel, Section } from './layout-components';

interface Props {
  data: CompleteResponse;
}

export const References = ({ data }: Props) => {
  return (
    <>
      <Section title="Variabelmetadata">
        <InfoPanel>
          <div>
            {data.classificationReference ? (
              <Field label='Kodeverkets URI' value={data.classificationReference} />
            ) : (
              <Paragraph data-size='sm'>—</Paragraph>
            )}
          </div>
          <div>
            {data.unitTypes && data.unitTypes.length > 0 ? (
              <Field label='Enhetstyper' value={data.unitTypes.join(', ')} />
            ) : (
              <Paragraph data-size='sm'>—</Paragraph>
            )}
          </div>
          <div>
            {data.subjectFields && data.subjectFields.length > 0 ? (
              <Field label='Statistikkområder' value={data.subjectFields.join(', ')} />
            ) : (
              <Paragraph data-size='sm'>—</Paragraph>
            )}
          </div>
          <div>
            {data.externalReferenceUri ? (
              <Field label='URI til ekstern referanse' value='Lenke' href={data.externalReferenceUri} />
            ) : (
              <Paragraph data-size='sm'>—</Paragraph>
            )}
          </div>
          <div>
            {data.relatedVariableDefinitionUris && data.relatedVariableDefinitionUris.length > 0 ? (
              <Field label='URI til relevante variabeldefinisjoner' value='Lenke' href={data.relatedVariableDefinitionUris.join(', ')} />
            ) : (
              <Paragraph data-size='sm'>—</Paragraph>
            )}
          </div>
        </InfoPanel>
      </Section>

      <Section title="Personopplysninger">
        <InfoPanel>
          <Field
            label='Inneholder særlige kategorier av personopplysninger'
            value={data.containsSpecialCategoriesOfPersonalData ? 'Ja' : 'Nei'}
          />
        </InfoPanel>
      </Section>
    </>
  );
};
