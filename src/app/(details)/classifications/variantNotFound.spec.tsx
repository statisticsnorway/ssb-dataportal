import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  params: {} as Record<string, string>,
}));

vi.mock('next/navigation', () => ({
  useParams: () => mocks.params,
}));

vi.mock('@/components/app-state', () => ({
  AppNotFoundState: ({ homeHref, secondaryHref }: { homeHref: string; secondaryHref: string }) => (
    <div>
      <a href={homeHref}>Home</a>
      <a href={secondaryHref}>Back</a>
    </div>
  ),
}));

describe('classification variant not-found routes', () => {
  it('links back to the latest version variants', async () => {
    mocks.params = { id: '104' };
    const { default: NotFound } = await import('./[id]/variants/[variantId]/not-found');

    render(<NotFound />);

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/classifications');
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/classifications/104/variants');
  });

  it('links back to the requested version variants', async () => {
    mocks.params = { id: '104', versionNumber: '10' };
    const { default: NotFound } = await import('./[id]/version/[versionNumber]/variants/[variantId]/not-found');

    render(<NotFound />);

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/classifications');
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/classifications/104/version/10/variants',
    );
  });
});
