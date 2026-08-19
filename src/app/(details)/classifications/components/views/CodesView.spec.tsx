import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ClassificationItemResource } from '@/libs/data-access/klass/models/ClassificationItemResource';
import versionsMock from '@/static-data/versions.json';
import type { KlassCode } from '@/types/klass-codes';
import { parseVersion } from '@/utils/mock-data';
import { CodesView } from './CodesView';

vi.mock('next/navigation', () => ({
  usePathname: () => '/classifications/2003/codes',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/app/(details)/classifications/components/download-dialog', () => ({
  DownloadCodesDialog: () => <div data-testid='download-codes-dialog' />,
}));

vi.mock('@/components/code-tree', () => ({
  CodeTree: ({
    codes,
    toolbar,
  }: {
    codes: KlassCode[];
    toolbar?: (controls: { allExpanded: boolean; hasExpandableNodes: boolean; toggleAll: () => void }) => ReactNode;
  }) => (
    <>
      {toolbar ? toolbar({ allExpanded: false, hasExpandableNodes: true, toggleAll: vi.fn() }) : null}
      <ul aria-label='filtered-codes'>
        {codes.map((code) => (
          <li key={code.code}>{`${code.code}:${code.name}`}</li>
        ))}
      </ul>
    </>
  ),
}));

const codes: ClassificationItemResource[] = [
  {
    code: '01',
    name: 'Agriculture',
    level: '1',
    parentCode: undefined,
    validFrom: new Date('2020-01-01'),
    validTo: undefined,
    shortName: undefined,
    notes: '',
  },
  {
    code: '01.1',
    name: 'Crop production',
    level: '2',
    parentCode: '01',
    validFrom: new Date('2020-01-01'),
    validTo: undefined,
    shortName: undefined,
    notes: '',
  },
  {
    code: '02',
    name: 'Forestry',
    level: '1',
    parentCode: undefined,
    validFrom: new Date('2020-01-01'),
    validTo: undefined,
    shortName: undefined,
    notes: '',
  },
];

const version = parseVersion(versionsMock.versions[0]);
version.classificationItems = codes;

describe('CodesView', () => {
  it('renders all codes before filters are applied', () => {
    render(<CodesView version={version} />);

    expect(screen.getByText('01:Agriculture')).toBeInTheDocument();
    expect(screen.getByText('01.1:Crop production')).toBeInTheDocument();
    expect(screen.getByText('02:Forestry')).toBeInTheDocument();
  });

  it.each([
    { searchTerm: '01', visible: '01:Agriculture', hidden: '02:Forestry' },
    { searchTerm: 'forestry', visible: '02:Forestry', hidden: '01:Agriculture' },
    { searchTerm: 'crop', visible: '01.1:Crop production', hidden: '02:Forestry' },
  ])('filters with "$searchTerm" using a single filter field', ({ searchTerm, visible, hidden }) => {
    render(<CodesView version={version} />);

    fireEvent.change(screen.getByLabelText('Filtrer på kode eller navn'), { target: { value: searchTerm } });

    expect(screen.getByText(visible)).toBeInTheDocument();
    expect(screen.queryByText(hidden)).not.toBeInTheDocument();
  });

  it('renders download button on codes tab when classification download data is available', () => {
    render(<CodesView version={version} classificationId={2003} />);

    expect(screen.getByRole('button', { name: 'Last ned' })).toBeInTheDocument();
  });
});
