import { Button, Dialog, Heading } from '@digdir/designsystemet-react';
import { type FC, type MouseEvent, type ReactNode, useId } from 'react';
import { localization } from '@/libs/language';
import styles from './mobile-filter-sheet.module.css';

interface MobileFilterSheetProps {
  open: boolean;
  onClose: () => void;
  heading: string;
  activeFilterCount: number;
  onClearFilters?: () => void;
  children: ReactNode;
}

/**
 * Bottom-sheet dialog presenting the filter content on phones.
 *
 * @param open             Whether the sheet is open
 * @param onClose          Called when the sheet closes (Show results, close button or Escape)
 * @param heading          Dialog heading
 * @param activeFilterCount Number of active filters, used to decide if Clear filters is shown
 * @param onClearFilters   Clears all active filters
 * @param children         Filter content, rendered in a scrollable area
 */
export const MobileFilterSheet: FC<MobileFilterSheetProps> = ({
  open,
  onClose,
  heading,
  activeFilterCount,
  onClearFilters,
  children,
}) => {
  const headingId = useId();

  // Clicks on the backdrop target the dialog element itself, outside its visible box.
  const closeOnBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) return;
    const { top, bottom, left, right } = event.currentTarget.getBoundingClientRect();
    const isOutside = event.clientY < top || event.clientY > bottom || event.clientX < left || event.clientX > right;
    if (isOutside) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onClick={closeOnBackdropClick}
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
        {activeFilterCount > 0 && onClearFilters ? (
          <Button variant='secondary' onClick={onClearFilters}>
            {localization.button.removeFilter}
          </Button>
        ) : null}
        <Button onClick={onClose}>{localization.search.filter.showResults}</Button>
      </Dialog.Block>
    </Dialog>
  );
};
