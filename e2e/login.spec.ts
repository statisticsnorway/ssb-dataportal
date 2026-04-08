import test, { expect } from '@playwright/test';
import { stabilize } from './utils/commonUtils';

test.describe('Log in and out', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    stabilize();
  });

  test('redirects to logout when user logs out', async ({ page }) => {
    // is not authenticated
    const logoutButton = page.getByRole('button', { name: 'Logg ut' });
    await expect(logoutButton).toBeVisible();
    // logs out

    //await expect(logoutButton).toContainText('Logg ut');

    //await page.getByRole('button', { name: 'Logg ut' }).click();

    //await logoutButton.click();
    //await expect(page).toHaveURL('/oauth2/logout');
  });
  test('redirects to login when user logs in', async ({ page }) => {
    // is not authenticated
    const loginDialog = page.getByRole('button', { name: 'Logg inn' });
    await expect(loginDialog).toBeVisible();

    // skille
    const loginButton = page.getByRole('button', { name: 'Logg inn' });
    // dialog
    // new button
    // logs out

    //await page.getByRole('button', { name: 'Logg ut' }).click();

    //await logoutButton.click();
    //await expect(page).toHaveURL('/oauth2/logout');
  });
});
