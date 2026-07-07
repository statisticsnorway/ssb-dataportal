import { describe, expect, it } from 'vitest';
import { validateEmailInput } from './validators';

describe('Validate email input', () => {
  it('returns true for a valid email', () => {
    expect(validateEmailInput('test@example.com')).toBe(true);
  });

  it('returns false for an invalid email', () => {
    expect(validateEmailInput('invalid-email')).toBe(false);
  });

  it('returns false for an empty email', () => {
    expect(validateEmailInput('')).toBe(false);
  });

  it('returns false for a null email', () => {
    expect(validateEmailInput(null as unknown as string)).toBe(false);
  });
});
