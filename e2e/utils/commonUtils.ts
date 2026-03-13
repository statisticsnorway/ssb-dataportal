import { expect, Locator, Page } from '@playwright/test';
import { variables } from './variables';

export async function checkCheckbox(checkboxLocator: Locator) {
  await expect(checkboxLocator).toBeVisible();
  await expect(checkboxLocator).toBeEnabled();
  await checkboxLocator.check();
  await expect(checkboxLocator).toBeChecked();
}

export async function stabilize(ms = 200) {
  await new Promise((r) => setTimeout(r, ms));
}
