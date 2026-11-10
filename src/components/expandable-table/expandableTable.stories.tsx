import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { ExpandableTable } from './index';

type TableVariant = NonNullable<ComponentProps<typeof ExpandableTable>['variant']>;

const tableVariants = ['default', 'seamless'] satisfies readonly TableVariant[];
const table = (
  <table>
    <thead>
      <tr>
        <th>Code</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>01</td>
        <td>Agriculture</td>
      </tr>
      <tr>
        <td>02</td>
        <td>Forestry</td>
      </tr>
    </tbody>
  </table>
);

const meta = {
  title: 'Components/ExpandableTable',
  component: ExpandableTable,
  args: {
    title: 'Classification codes',
    ariaLabel: 'Classification codes',
    table,
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: tableVariants,
    },
  },
} satisfies Meta<typeof ExpandableTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Seamless: Story = { args: { variant: 'seamless' } };
export const EmptyMessage: Story = { args: { table: undefined, message: 'No table is available.' } };
