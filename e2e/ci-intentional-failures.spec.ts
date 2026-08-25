import { expect, test } from '@bgotink/playwright-coverage';

// Temporary CI reporting probe.
// Delete this entire file after verifying the consolidated e2e result handling.
test.describe('TEMPORARY intentional failures for CI reporting', () => {
  test('INTENTIONAL FAILURE 1 - consolidated reporting probe', async () => {
    expect(true, 'Temporary failure used to verify shard aggregation').toBe(false);
  });

  test('INTENTIONAL FAILURE 2 - consolidated reporting probe', async () => {
    expect(true, 'Temporary failure used to verify shard aggregation').toBe(false);
  });

  test('INTENTIONAL FAILURE 3 - consolidated reporting probe', async () => {
    expect(true, 'Temporary failure used to verify shard aggregation').toBe(false);
  });

  test('INTENTIONAL FAILURE 4 - consolidated reporting probe', async () => {
    expect(true, 'Temporary failure used to verify shard aggregation').toBe(false);
  });
});
