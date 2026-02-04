import { Heading } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import { localization } from '@/libs/language/src/localization';

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
      <Heading level={2} data-size='sm'>
        {localization.search.filter.label}
      </Heading>
      {children}
    </>
  );
};

export { FiltersPanel };
