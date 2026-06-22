import { Tag } from '@statisticsnorway/design-react';
import classNames from 'classnames';
import { VariableStatus } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language/src/localization';
import { convertStatus } from '@/utils/functions';

interface StatusTagProps {
  variableStatus: VariableStatus;
  className?: string;
}

/**
 * StatusTag component displays a tag representing the status of a variable.
 *
 * @param variableStatus - The current status of the variable. Determines the displayed label text.
 * @param className - Optional additional CSS class for custom styling.
 *
 * @returns A Tag component displaying the formatted variable status.
 */
const StatusTag = ({ variableStatus, className }: StatusTagProps) => {
  return (
    <Tag data-color='warning' aria-label={localization.status.label} className={classNames(className)} data-size='md'>
      {convertStatus(variableStatus)}
    </Tag>
  );
};

export { StatusTag };
