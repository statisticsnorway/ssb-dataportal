import { AppNotFoundState } from '@/components/app-state';

export default function NotFoundPage() {
  return (
    <AppNotFoundState
      title='Beklager, vi fant ikke siden'
      message='Denne siden kan være slettet eller flyttet, eller lenken kan være feil.'
      homeHref='/'
    />
  );
}
