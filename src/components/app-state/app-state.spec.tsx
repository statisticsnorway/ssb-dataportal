import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppState, AppStateAction } from '@/components/app-state/app-state';

describe('AppState', () => {
  it('render title and message', () => {
    render(
      <AppState title='Beklager, noe gikk galt' message='Vi opplever tekniske problemer' titleId='app-state-title' />,
    );
    expect(screen.getByRole('heading', { name: 'Beklager, noe gikk galt' })).toBeInTheDocument();
    expect(screen.getByText('Vi opplever tekniske problemer')).toBeInTheDocument();
  });

  it('render status and reference codes', () => {
    render(<AppState title='Feil' message={'Something'} titleId={'app-id'} statusCode={'500'} referenceCode={'123'} />);
    expect(screen.getByText('Feilkode: 500')).toBeInTheDocument();
    expect(screen.getByText('Referanse: 123')).toBeInTheDocument();
  });

  it('help - rendering', () => {
    render(
      <AppState
        title={'Feil'}
        message={'Dummy'}
        titleId={'app-id'}
        helpTitle={'Du kan prøve:'}
        helpList={['vente', 'gå til forsiden']}
      />,
    );
    expect(screen.getByText('Du kan prøve:')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('vente')).toBeInTheDocument();
    expect(screen.getByText('gå til forsiden')).toBeInTheDocument();
  });

  it('render external link', () => {
    const actions: AppStateAction[] = [
      {
        kind: 'link',
        label: 'kontakt',
        href: 'https://google.com',
        external: true,
        variant: 'secondary',
      },
    ];
    render(<AppState title='Feil' message='Noe gikk galt' titleId='app-id' actions={actions} />);
    const link = screen.getByRole('link', { name: 'kontakt' });
    expect(link).toHaveAttribute('href', 'https://google.com');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('render internal link', () => {
    const actions: AppStateAction[] = [
      {
        kind: 'link',
        label: 'Gå til forsiden',
        href: '/',
        variant: 'primary',
      },
    ];
    render(<AppState title={'Feil'} message={'Noe gikk galt'} titleId={'app-id'} actions={actions} />);
    const link = screen.getByRole('link', { name: 'Gå til forsiden' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('render button action and call click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const actions: AppStateAction[] = [
      {
        kind: 'button',
        label: 'Prøv igjen',
        onClick,
        variant: 'primary',
      },
    ];
    render(<AppState title={'Feil'} message={'Noe gikk galt'} titleId={'app-id'} actions={actions} />);
    await user.click(screen.getByRole('button', { name: 'Prøv igjen' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('do not render optional sections', () => {
    render(<AppState title={'Feil'} message={'Noe gikk galt'} titleId={'app-id'} />);
    expect(screen.queryByText(/^Feilkode:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Referanse:/)).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
