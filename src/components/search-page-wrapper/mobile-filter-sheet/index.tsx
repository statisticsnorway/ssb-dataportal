import { Button, Dialog, Heading } from '@digdir/designsystemet-react';
import { type FC, type ReactNode, useId } from 'react';
import { localization } from '@/libs/language';
import styles from './mobile-filter-sheet.module.css';

interface MobileFilterSheetProps {
  open: boolean;
  onClose: () => void;
  heading: string;
  onClearFilters?: () => void;
  children: ReactNode;
}

/**
 * Bottom-sheet dialog presenting the filter content on phones.
 *
 * @param open           Whether the sheet is open
 * @param onClose        Called when the sheet closes (Show results, close button, backdrop click or Escape)
 * @param heading        Dialog heading
 * @param onClearFilters Clears all active filters; the Clear filters button is only shown when provided
 * @param children       Filter content, rendered in a scrollable area
 */
export const MobileFilterSheet: FC<MobileFilterSheetProps> = ({ open, onClose, heading, onClearFilters, children }) => {
  const headingId = useId();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      closedby='any'
      placement='bottom'
      closeButton={localization.search.filter.close}
      aria-labelledby={headingId}
      className={styles.sheet}
      data-testid='mobile-filter-sheet'
    >
      <Dialog.Block className={styles.header}>
        <Heading id={headingId} level={2} data-size='sm' className='secondaryHeading'>
          {heading}
        </Heading>
      </Dialog.Block>
      <Dialog.Block className={styles.content}>{children}</Dialog.Block>
      <Dialog.Block className={styles.actions}>
        {onClearFilters ? (
          <Button variant='secondary' onClick={onClearFilters}>
            {localization.button.removeFilter}
          </Button>
        ) : null}
        <Button onClick={onClose}>{localization.search.filter.showResults}</Button>
      </Dialog.Block>
    </Dialog>
  );
};
