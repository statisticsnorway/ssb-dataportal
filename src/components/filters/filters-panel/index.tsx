import { Heading } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';

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
  return (
    <>
      <Heading className={visuallyHideHeading ? 'ds-sr-only' : 'secondaryHeading'} level={2} data-size='sm'>
        {heading}
      </Heading>
      {children}
    </>
  );
};

export { FiltersPanel };
