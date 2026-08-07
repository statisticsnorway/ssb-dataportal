import { Heading } from '@digdir/designsystemet-react';
import { ClassificationVersionResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language/src/localization';
import { formatVariantName, mapVariantItems } from '../../utils/variants';
import { ClassificationCard } from '../classification-cards';
import styles from './views.module.css';

interface VariantsViewProps {
  classificationVersion: ClassificationVersionResource;
}

export default function VariantsView({ classificationVersion }: Readonly<VariantsViewProps>) {
  const variants = classificationVersion?.classificationVariants ?? [];
  return (
    <div className={styles.aboutWrapper}>
      <header>
        <Heading className='secondaryHeading' data-size='md' level={2}>
          {localization.classification.variant.variantHeading}
        </Heading>
        <p>{localization.classification.variant.variantInfo}</p>
      </header>
      {variants.map((variant) => (
        <ClassificationCard
          title={formatVariantName(variant.name)}
          content={mapVariantItems(variant)}
          key={variant.id}
        />
      ))}
    </div>
  );
}
