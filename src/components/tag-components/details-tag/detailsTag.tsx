import { Popover, Tag } from '@digdir/designsystemet-react';
import { QuestionmarkCircleIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { Item } from '@/types/item';
import styles from './detailsTag.module.css';

interface DetailsTagProps {
  className?: string;
  text?: string | ReactNode;
  tags?: Item[];
  popover?: boolean;
  popoverText?: string;
}

const DetailsTag = ({ className, text, tags, popover = false, popoverText }: DetailsTagProps) => {
  if (tags?.length) {
    return (
      <div className={styles.tagsList}>
        {tags.map((item) => (
          <Tag key={item.label} className={`${styles.tagsListItem} classNames(className)}`} data-size='md'>
            {item.value ?? item.label}
          </Tag>
        ))}
      </div>
    );
  }
  return popover ? (
    <>
      <Tag popoverTarget='info' className={classNames(className)} data-size='lg'>
        {text}
        <QuestionmarkCircleIcon aria-hidden='true' style={{ marginLeft: '0.5rem' }} />
      </Tag>
      <Popover id='info'>{popoverText}</Popover>
    </>
  ) : (
    <Tag className={classNames(className)} data-size='lg'>
      {text}
    </Tag>
  );
};

export { DetailsTag };
