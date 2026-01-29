import { Heading } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';

const FILTER_HEADING = 'Filter'; // TODO localize

interface FiltersPanelProps {
  children: ReactNode;
}

/**
 * FiltersPanel component renders its children inside a panel.
 *
 * @param children - React nodes to display inside the panel.
 */
const FiltersPanel = ({ children }: FiltersPanelProps) => {
  return (
    <>
      <Heading level={3} data-size="sm">
        {FILTER_HEADING}
      </Heading>
      {children}
    </>
  );
};

export { FiltersPanel };
