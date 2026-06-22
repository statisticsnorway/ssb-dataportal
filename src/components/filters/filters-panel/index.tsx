import { Heading } from '@statisticsnorway/design-react';
import { ReactNode } from 'react';

interface FiltersPanelProps {
  heading: string;
  children: ReactNode;
}

/**
 * FiltersPanel component renders its children inside a panel.
 *
 * @param children - React nodes to display inside the panel.
 */
const FiltersPanel = ({ heading, children }: FiltersPanelProps) => {
  return (
    <>
      <Heading className='secondaryHeading' level={2} data-size='sm'>
        {heading}
      </Heading>
      {children}
    </>
  );
};

export { FiltersPanel };
