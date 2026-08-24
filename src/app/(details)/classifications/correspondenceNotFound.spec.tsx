import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '91', versionNumber: '363' }),
}));

vi.mock('@/components/app-state', () => ({
  AppNotFoundState: ({
    title,
    message,
    helpList,
    homeHref,
    secondaryHref,
  }: {
    title: string;
    message: string;
    helpList: readonly string[];
    homeHref: string;
    secondaryHref: string;
  }) => (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
      <ul>
        {helpList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <a href={homeHref}>Home</a>
      <a href={secondaryHref}>Back</a>
    </div>
  ),
}));

describe('classification correspondence not-found route', () => {
  it('shows correspondence-specific guidance and links back to the selected version', async () => {
    const { default: NotFound } = await import(
      './[id]/versions/[versionNumber]/correspondences/[correspondenceId]/not-found'
    );
    render(<NotFound />);
    expect(screen.getByRole('heading', { name: 'Korrespondanse ikke funnet' })).toBeVisible();
    expect(
      screen.getByText('Er det skrivefeil i lenken? Eller har korrespondansen blitt slettet eller flyttet?'),
    ).toBeVisible();
    expect(screen.getByText('sjekke at du har riktig korrespondanse-id i lenken')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/classifications');
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/classifications/91/versions/363/correspondences',
    );
  });
});
