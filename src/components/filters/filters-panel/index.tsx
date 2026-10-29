import { Heading } from '@digdir/designsystemet-react';
import { createContext, ReactNode, useContext } from 'react';
import styles from './filters-panel.module.css';

/**
 * Lets the search page place the active filter tags between the panel heading and the filters (desktop sidebar).
 */
export const FilterTagsSlotContext = createContext<ReactNode>(null);

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
      {tags}
      {children}
    </>
  );
};

export { FiltersPanel };
