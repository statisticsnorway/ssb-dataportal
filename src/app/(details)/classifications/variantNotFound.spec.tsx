import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  params: {} as Record<string, string>,
}));

vi.mock('next/navigation', () => ({
  useParams: () => mocks.params,
}));

vi.mock('@/components/app-state', () => ({
  AppNotFoundState: ({
    homeHref,
    secondaryHref,
    title,
    message,
    helpList,
  }: {
    homeHref: string;
    secondaryHref: string;
    title?: string;
    message?: string;
    helpList?: string[];
  }) => (
    <div>
      <a href={homeHref}>Home</a>
      <a href={secondaryHref}>Back</a>
      <div data-testid='title'>{title}</div>
      <div data-testid='message'>{message}</div>
      <ul data-testid='help-list'>
        {helpList?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
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
    const { default: NotFound } = await import('./[id]/versions/[versionNumber]/variants/[variantId]/not-found');

    render(<NotFound />);

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/classifications');
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/classifications/104/versions/10/variants',
    );
  });

  it('uses correspondence-specific content for a direct correspondence route', async () => {
    mocks.params = { id: '79' };
    const { default: NotFound } = await import('./[id]/correspondences/[correspondenceId]/not-found');

    render(<NotFound />);

    expect(screen.getByTestId('title')).toHaveTextContent('Korrespondansetabell ikke funnet');
    expect(screen.getByTestId('message')).toHaveTextContent('korrespondansetabellen');
    expect(screen.getByTestId('help-list')).toHaveTextContent('korrespondansetabell-id');
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/classifications/79/correspondences');
  });

  it('links back to the requested version correspondences', async () => {
    mocks.params = { id: '79', versionNumber: '10' };
    const { default: NotFound } = await import(
      './[id]/versions/[versionNumber]/correspondences/[correspondenceId]/not-found'
    );

    render(<NotFound />);

    expect(screen.getByTestId('title')).toHaveTextContent('Korrespondansetabell ikke funnet');
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/classifications/79/versions/10/correspondences',
    );
  });
});
