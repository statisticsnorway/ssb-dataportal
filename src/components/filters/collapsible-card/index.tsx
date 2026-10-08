import { Card, Details, DetailsSummary, Fieldset } from '@digdir/designsystemet-react';
import type { ReactNode } from 'react';
import { useId, useState } from 'react';
import styles from './collapsable-card.module.css';

interface CollapsibleCardProps {
  heading: string;
  children: ReactNode;
  defaultOpen?: boolean;
  cardClassName?: string;
  contentClassName?: string;
  toggleButtonClassName?: string;
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
  toggleButtonClassName = '',
}: Readonly<CollapsibleCardProps>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <Card className={`${styles.filterCard} ${cardClassName}`}>
      <Fieldset className={styles.fieldset} aria-label={heading}>
        <Details
          className={styles.details}
          defaultOpen={defaultOpen}
          onToggle={(event) => setIsOpen((event.currentTarget as HTMLDetailsElement).open)}
        >
          <DetailsSummary
            id={`${panelId}-heading`}
            className={`${styles.toggleFilter} ${toggleButtonClassName}`}
            role='button'
            aria-expanded={isOpen}
            aria-controls={`${panelId}-content`}
          >
            {heading}
          </DetailsSummary>
          <div id={`${panelId}-content`} className={`${styles.filterItems} ${contentClassName}`}>
            {children}
          </div>
        </Details>
      </Fieldset>
    </Card>
  );
}
