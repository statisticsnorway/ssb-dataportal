import { expectButtonVisible, stabilize } from './utils/commonUtils';
import { test, expect } from './fixtures/unauth.fixture';
import { localization } from '@/libs/language';
import { Page } from '@playwright/test';

async function openLoginDialog(page: Page) {
  const loginButton = await expectButtonVisible(page, localization.authentication.logIn);
  await loginButton.click();
  const loginDialog = page.getByRole('dialog');
  await expect(loginDialog).toBeVisible();
  return loginDialog;
}

test.describe('Log in and out', () => {
  const logInText = localization.authentication.logIn;
  const logInAsText = localization.authentication.logInAs;
  const logOutText = localization.authentication.logOut;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    stabilize();
  });

  const authButtonTests = [
    { project: 'chrome-unauth', buttonText: logInText },
    { project: 'chromium', buttonText: logOutText },
    { project: 'firefox', buttonText: logOutText },
  ];
  authButtonTests.forEach(({ project, buttonText }) => {
    test(`displays "${buttonText}" button correctly for project: ${project}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== project);
      await expectButtonVisible(page, buttonText);
    });
  });

  test('log in button opens up dialog box', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
    const loginDialog = await openLoginDialog(page);
    await expect(loginDialog).toContainText('Innlogging');
  });

  test('log out button redirects to log out page', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    const logoutButton = await expectButtonVisible(page, logOutText);
    await logoutButton.click();
    await expect(page).toHaveURL(/oauth2\/logout$/);
  });

  test('log in as SSB employee redirects to login page', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');

    await test.step('Open login dialog', async () => {
      await openLoginDialog(page);
    });

    await test.step('Click log in as employee', async () => {
      const finalLoginButton = await expectButtonVisible(page, logInAsText);
      await finalLoginButton.click();
      await expect(page).toHaveURL(/oauth2\/login$/);
    });
  });
});
