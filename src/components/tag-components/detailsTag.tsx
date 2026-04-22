import { Popover, Tag } from '@digdir/designsystemet-react';
import { QuestionmarkCircleIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import { ReactNode } from 'react';

interface DetailsTagProps {
  className?: string;
  text: string | ReactNode;
  popover?: boolean;
}

const DetailsTag = ({ className, text, popover = false }: DetailsTagProps) => {
  return popover ? (
    <>
      <Tag popoverTarget='info' className={classNames(className)} data-size='lg'>
        {text}
        <QuestionmarkCircleIcon title='More info' focusable={true} style={{ marginLeft: '0.5rem' }} />
      </Tag>
      <Popover id='info'>Info</Popover>
    </>
  ) : (
    <Tag className={classNames(className)} data-size='lg'>
      {text}
    </Tag>
  );
};

export { DetailsTag };
