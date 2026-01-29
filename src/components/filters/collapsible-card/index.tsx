import { Button, Card, Fieldset, FieldsetLegend } from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { ReactNode, useState } from 'react';
import styles from './collapsable-card.module.css';

interface CollapsibleCardProps {
  heading: string;
  children: ReactNode;
  defaultOpen?: boolean;
  cardClassName?: string;
  contentClassName?: string;
}

export function CollapsibleCard({
  heading,
  children,
  defaultOpen = true,
  cardClassName = '',
  contentClassName = '',
}: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <Card className={`${styles.filterCard} ${cardClassName} ${!isOpen ? styles.hidden : ''}`}>
      <Fieldset>
        <Button
          className={styles.toggleFilter}
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-controls={`collapsible-${heading}`}
        >
          <FieldsetLegend className={styles.filterHeader}>{heading}</FieldsetLegend>
          {isOpen ? (
            <ChevronDownIcon title='Lukk filter' className={styles.chevronUpDown} />
          ) : (
            <ChevronUpIcon title='Åpne filter' className={styles.chevronUpDown} />
          )}
        </Button>

        {isOpen && (
          <div id={`collapsible-${heading}`} className={`${styles.filterItems} ${contentClassName}`}>
            {children}
          </div>
        )}
      </Fieldset>
    </Card>
  );
}
