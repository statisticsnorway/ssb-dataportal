import { stabilize } from './utils/commonUtils';
import { test, expect } from './fixtures/unauth.fixture';

test.describe('Log in and out', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    stabilize();
  });

  test('[@unauth]redirects to logout when user logs out', async ({ page }, testInfo) => {
    // is not authenticated
    if (testInfo.project.name !== 'chrome-unauth') {
      testInfo.skip();
    }
    const logoutButton = page.getByRole('button', { name: 'Logg ut' });
    await page.pause();
    console.log(await page.content());
    console.log(logoutButton);
    //await expect(logoutButton).toBeVisible();
  });
  test('redirects to login when user logs in', async ({ page }, testInfo) => {
    // is not authenticated
    if (testInfo.project.name === 'chrome-unauth') {
      testInfo.skip();
    }
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
    // logs out

    //await expect(logoutButton).toContainText('Logg ut');

    //await page.getByRole('button', { name: 'Logg ut' }).click();

    //await logoutButton.click();
    //await expect(page).toHaveURL('/oauth2/logout');
  });
});
