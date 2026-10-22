import { Heading } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './filters-panel.module.css';

interface FiltersPanelProps {
  heading: string;
  children: ReactNode;
  afterHeading?: ReactNode;
  visuallyHideHeading?: boolean;
}

/**
 * FiltersPanel component renders its children inside a panel.
 *
 * @param heading - Heading used to label the filter panel.
 * @param afterHeading - Optional content shown directly below the heading and before filter controls.
 * @param children - Filter controls displayed inside the panel.
 * @param visuallyHideHeading - Whether the heading should only be available to assistive technology.
 */
const FiltersPanel = ({ heading, children, afterHeading, visuallyHideHeading = false }: FiltersPanelProps) => {
  return (
    <>
      <Heading
        className={visuallyHideHeading ? 'ds-sr-only' : `secondaryHeading ${styles.heading}`}
        level={2}
        data-size='sm'
      >
        {heading}
      </Heading>
      {afterHeading}
      {children}
    </>
  );
};

export { FiltersPanel };
