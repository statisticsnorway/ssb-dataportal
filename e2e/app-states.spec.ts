import { expect, test } from '@playwright/test';

test.describe('app state routes', () => {
  test('global not-found page is shown for unknown route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');

    await expect(page.getByRole('heading', { name: 'Beklager, vi fant ikke siden' })).toBeVisible();
    await expect(
      page.getByText('Denne siden kan være slettet eller flyttet, eller lenken kan være feil.'),
    ).toBeVisible();

    await expect(page.getByRole('link', { name: 'Gå til forsiden' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Meld fra om ødelagt lenke' })).toBeVisible();
  });

  test('variable definition route-specific not-found is shown', async ({ page }) => {
    await page.goto('/variable-definitions/does-not-exist');

    await expect(page.getByRole('heading', { name: 'Variabeldefinisjon ikke funnet' })).toBeVisible();
    await expect(
      page.getByText('Er det skrivefeil i lenken? Eller har variabeldefinisjonen blitt slettet eller flyttet?'),
    ).toBeVisible();

    await expect(page.getByText('Du kan prøve å:')).toBeVisible();
    await expect(
      page.getByRole('listitem').filter({ hasText: 'sjekke at du har riktig variabeldefinisjon-kortnavn i lenken' }),
    ).toBeVisible();
    await expect(
      page.getByRole('listitem').filter({ hasText: 'gå til oversikten over variabeldefinisjoner' }),
    ).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'gå til forsiden' })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Gå til forsiden' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Variabeldefinisjoner' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Meld fra om ødelagt lenke' })).toHaveCount(0);
  });

  test('global error page is shown for test error route', async ({ page }) => {
    await page.goto('/test/error');

    await expect(page.getByRole('heading', { name: 'Beklager, noe gikk galt' })).toBeVisible();
    await expect(
      page.getByText('Vi opplever tekniske problemer og jobber med å løse dem. Dette skyldes ikke noe du gjorde.'),
    ).toBeVisible();

    await expect(page.getByText('Du kan prøve å:')).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'vente litt og laste siden på nytt' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'gå tilbake til forrige side' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'gå til forsiden' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Last siden på nytt' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Gå til forsiden' })).toBeVisible();
  });
});
