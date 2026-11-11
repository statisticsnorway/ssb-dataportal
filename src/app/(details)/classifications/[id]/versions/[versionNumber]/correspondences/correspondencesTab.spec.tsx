import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ClassificationVersionResource } from '@/libs/data-access/klass';

const mocks = vi.hoisted(() => ({
  useVersion: vi.fn(),
  correspondencesView: vi.fn(() => <div data-testid='correspondences-view' />),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next/navigation', () => ({
  notFound: mocks.notFound,
}));

vi.mock('@/app/(details)/classifications/components/versionContext', () => ({
  useVersion: mocks.useVersion,
}));

vi.mock('@/app/(details)/classifications/components/views/CorrespondencesView', () => ({
  default: mocks.correspondencesView,
}));

const versionResource: ClassificationVersionResource = { id: 1698 };

describe('Version-pinned correspondences tab', () => {
  it('pins the links to the version in the url', async () => {
    mocks.useVersion.mockReturnValue({ classification: { id: 91 }, versionResource });
    const { default: Correspondences } = await import('./page');

    render(<Correspondences />);

    expect(screen.getByTestId('correspondences-view')).toBeInTheDocument();
    expect(mocks.correspondencesView).toHaveBeenCalledWith(
      { classificationId: 91, classificationVersion: versionResource, versionId: 1698 },
      undefined,
    );
  });

  it('returns not found when the version resource is missing', async () => {
    mocks.useVersion.mockReturnValue({ classification: { id: 91 }, versionResource: undefined });
    const { default: Correspondences } = await import('./page');

    expect(() => render(<Correspondences />)).toThrow('NEXT_NOT_FOUND');
  });
});
