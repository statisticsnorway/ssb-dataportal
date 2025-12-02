import { Paragraph } from '@digdir/designsystemet-react';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { DetailsPagePanel } from './details-page-panel';

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
    containsSpecialCategoriesOfPersonalData,
  } = data;

  return (
    <>
        <DetailsPagePanel title='Variabelmetadata'
          elements={[
            { label: 'Kodeverkets URI', value: classificationReference || <EmptyValue /> },
            { label: 'Enhetstyper', value: unitTypes?.length ? unitTypes.join(', ') : <EmptyValue /> },
            { label: 'Statistikkområder', value: subjectFields?.length ? subjectFields.join(', ') : <EmptyValue /> },
            { label: 'URI til ekstern referanse', value: externalReferenceUri || <EmptyValue />, href: externalReferenceUri || undefined },
            { label: 'URI til relevante variabeldefinisjoner', value: relatedVariableDefinitionUris?.length ? relatedVariableDefinitionUris.join(', ') : <EmptyValue />, href: relatedVariableDefinitionUris?.join(', ') },
          ]}
        />  

        <DetailsPagePanel title='Personopplysninger'
          elements={[
            { label: 'Inneholder særlige kategorier av personopplysninger', value: containsSpecialCategoriesOfPersonalData ? 'Ja' : 'Nei' },
          ]}
        />
    </>
  );
};
