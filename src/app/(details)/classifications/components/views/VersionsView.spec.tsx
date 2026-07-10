import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import classificationMock from '@/static-data/classifications.json';
import VersionsView from './VersionsView';

vi.mock('@/app/(details)/classifications/components/versions-table', () => ({
  VersionsTable: ({ content }: { content: unknown[] }) => (
    <div data-testid='versions-table'>rows: {content.length}</div>
  ),
}));

const classification = classificationMock.classifications[0] as unknown as ClassificationResource;

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

describe('VersionsView', () => {
  const versions = [classification];

  it('renders VersionsTable with mapped versions', () => {
    render(<VersionsView classificationId={2003} versions={versions} />);
    expect(screen.getByTestId('versions-table')).toBeDefined();
  });

  it('passes correct number of rows to VersionsTable', () => {
    render(<VersionsView classificationId={2003} versions={versions} />);
    expect(screen.getByText(`rows: ${versions.length}`)).toBeDefined();
  });
});
