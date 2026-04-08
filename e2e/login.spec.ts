import test from '@playwright/test';
import { stabilize } from './utils/commonUtils';

test.describe('Log in and out', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    stabilize();
  });
});
