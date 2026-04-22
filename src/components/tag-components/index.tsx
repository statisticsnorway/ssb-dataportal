import { Popover, Tag } from '@digdir/designsystemet-react';
import { QuestionmarkCircleIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { VariableStatus } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language/src/localization';
import { convertStatus, statusColors } from '@/utils/functions';

interface StatusTagProps {
  variableStatus: VariableStatus;
  className?: string;
}

/**
 * StatusTag component displays a colored tag representing the status of a variable.
 *
 * @param VariableStatus - The current status of the variable. Determines the tag color and text.
 * @param className - Optional additional CSS class for custom styling.
 *
 * @returns A Tag component with a background color corresponding to the variable's status.
 *
 */
const StatusTag = ({ variableStatus, className }: StatusTagProps) => {
  const color = statusColors[variableStatus];
  return (
    <Tag
      aria-label={localization.status.label}
      className={classNames(className)}
      data-size='md'
      style={{ backgroundColor: color }}
    >
      {convertStatus(variableStatus)}
    </Tag>
  );
};

export { StatusTag };

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
        <QuestionmarkCircleIcon style={{ marginLeft: '0.5rem' }} />
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
