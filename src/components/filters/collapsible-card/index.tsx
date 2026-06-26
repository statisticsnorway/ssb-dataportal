import { Button, Card, Fieldset, FieldsetLegend } from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { ReactNode, useState } from 'react';
import { localization } from '@/libs/language/src/localization';
import { sanitizeId } from '@/utils/functions';
import styles from './collapsable-card.module.css';

interface CollapsibleCardProps {
  heading: string;
  children: ReactNode;
  defaultOpen?: boolean;
  cardClassName?: string;
  contentClassName?: string;
}

/**
 * A reusable card component with collapsible content.
 *
 * Displays a heading inside a card and allows the user to toggle
 * the visibility of its children.
 *
 * @param props - The props for the CollapsibleCard component.
 * @param props.heading - The title displayed at the top of the card.
 * @param props.children - The content shown inside the card when expanded.
 * @param props.defaultOpen - Whether the card is open by default. Defaults to `true`.
 * @param props.cardClassName - Optional additional class names applied to the Card.
 * @param props.contentClassName - Optional additional class names applied to the content container.
 *
 * @returns A collapsible card UI component.
 */
export function CollapsibleCard({
  heading,
  children,
  defaultOpen = true,
  cardClassName = '',
  contentClassName = '',
}: Readonly<CollapsibleCardProps>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const headingId = `collapsible-${sanitizeId(heading)}-heading`;
  const panelId = `collapsible-${sanitizeId(heading)}-panel`;
  const hiddenClassName = isOpen ? '' : styles.hidden;

  return (
    <Card className={`${styles.filterCard} ${cardClassName} ${hiddenClassName}`}>
      <Fieldset aria-labelledby={headingId}>
        <FieldsetLegend className={styles.filterHeader} id={headingId}>
          <Button className={styles.toggleFilter} onClick={toggleOpen} aria-expanded={isOpen} aria-controls={panelId}>
            {heading}
            {isOpen ? (
              <ChevronDownIcon title={localization.search.filter.close} className={styles.chevronUpDown} />
            ) : (
              <ChevronUpIcon title={localization.search.filter.open} className={styles.chevronUpDown} />
            )}
          </Button>
        </FieldsetLegend>

        {isOpen && (
          <div id={panelId} className={`${styles.filterItems} ${contentClassName}`}>
            {children}
          </div>
        )}
      </Fieldset>
    </Card>
  );
}
