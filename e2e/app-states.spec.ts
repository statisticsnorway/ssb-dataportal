import { expect, test, TestInfo } from '@playwright/test';

test.describe('app state routes', () => {
  test.beforeEach(({}, testInfo: TestInfo) => {
    if (testInfo.project.name === 'chrome-unauth') {
      testInfo.skip();
    }
  });

  test('global not-found page is shown for unknown route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('heading', { name: 'Siden finnes ikke' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Gå til forsiden' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Meld fra om ødelagt lenke' })).toBeVisible();
  });

  test('variable definition route-specific not-found is shown', async ({ page }) => {
    await page.goto('/variable-definitions/does-not-exist');
    await expect(page.getByRole('heading', { name: 'Variabeldefinisjon ikke funnet' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Gå til forsiden' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Variabeldefinisjoner' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Meld fra om ødelagt lenke' })).toHaveCount(0);
  });

  test('global error page is shown for test error route', async ({ page }) => {
    await page.goto('/test/error');
    await expect(page.getByText(/^Referanse:/)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Beklager, noe gikk galt' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Last siden på nytt' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Gå til forsiden' })).toBeVisible();
  });

  test('broken link action on global not-found is a mailto link', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    const brokenLink = page.getByRole('link', { name: 'Meld fra om ødelagt lenke' });
    await expect(brokenLink).toBeVisible();
    await expect(brokenLink).toHaveAttribute('href', /mailto:metadata@ssb\.no/);
  });

  test('retry button is usable on error page', async ({ page }) => {
    await page.goto('/test/error');
    const retryButton = page.getByRole('button', { name: 'Last siden på nytt' });
    await expect(retryButton).toBeVisible();
    await retryButton.click();
    await expect(page.getByRole('heading', { name: 'Beklager, noe gikk galt' })).toBeVisible();
  });
  test('Unknown shortName shows not-found page with warning alert', async ({ page }) => {
    const missingShortName = `missing-${Date.now()}`;
    await page.goto(`/variable-definitions/${missingShortName}`);
    const heading = page.locator('#app-not-found-title');
    await expect(heading).toHaveText('Variabeldefinisjon ikke funnet');
  });
});
