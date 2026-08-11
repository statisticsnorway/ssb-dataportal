import { Alert, Heading } from '@digdir/designsystemet-react';
import { ClassificationVersionResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language/src/localization';
import { formatVariantName, mapVariantItems } from '../../utils/variants';
import { ClassificationCard } from '../classification-cards';
import styles from './views.module.css';

interface VariantsViewProps {
  classificationVersion: ClassificationVersionResource;
  classificationId: number;
}

export default function VariantsView({ classificationVersion, classificationId }: Readonly<VariantsViewProps>) {
  const variants = classificationVersion?.classificationVariants ?? [];
  return (
    <div className={styles.aboutWrapper}>
      <header>
        <Heading className='secondaryHeading' data-size='md' level={2}>
          {localization.classification.variant.variantHeading}
        </Heading>
        <p>{localization.classification.variant.variantInfo}</p>
      </header>
      {variants.length > 0 &&
        variants.map((variant) => (
          <ClassificationCard
            title={formatVariantName(variant.name)}
            content={mapVariantItems(variant)}
            href={`/classifications/${classificationId}/variant/${variant.id}`}
            key={variant.id}
          />
        ))}
      {variants.length === 0 && (
        <Alert role='status' data-color='info'>
          {localization.classification.variant.noVariants}
        </Alert>
      )}
    </div>
  );
}
