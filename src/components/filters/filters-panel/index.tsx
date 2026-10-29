import { Heading } from '@digdir/designsystemet-react';
import { ReactNode, useContext } from 'react';
import { localization } from '@/libs/language';
import { FilterTagsSlotContext } from './filter-tags-slot';
import styles from './filters-panel.module.css';

interface FiltersPanelProps {
  heading: string;
  children: ReactNode;
  visuallyHideHeading?: boolean;
}

/**
 * FiltersPanel component renders its children inside a panel.
 *
 * @param heading - Heading used to label the filter panel.
 * @param children - React nodes to display inside the panel.
 * @param visuallyHideHeading - Whether the heading should only be available to assistive technology.
 */
const FiltersPanel = ({ heading, children, visuallyHideHeading = false }: FiltersPanelProps) => {
  const tags = useContext(FilterTagsSlotContext);

  return (
    <>
      <Heading
        className={visuallyHideHeading ? 'ds-sr-only' : `secondaryHeading ${styles.heading}`}
        level={2}
        data-size='sm'
      >
        {heading}
      </Heading>
      {tags ? (
        <section
          id='filter-tags-section'
          className={styles.tags}
          aria-label={localization.filterTag.sectionLabel}
          style={{ scrollMarginTop: '2rem' }}
        >
          {tags}
        </section>
      ) : null}
      {children}
    </>
  );
};

export { FiltersPanel };
