import { Tag } from '@digdir/designsystemet-react';
import classNames from 'classnames';
import { VariableStatus } from '@/libs/data-access/variable-definitions/internal';
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
    <Tag className={classNames(className)} data-size='md' style={{ backgroundColor: color }}>
      {convertStatus(variableStatus)}
    </Tag>
  );
};

export { StatusTag };
