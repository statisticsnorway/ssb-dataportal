import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/libs/logger/server-logger', () => ({
  createLogger: () => ({ info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() }),
}));
vi.mock('@/libs/logger/sanitize', () => ({ sanitizeError: vi.fn((e) => e) }));

// Polyfill CSS.supports for jsdom
if (typeof CSS === 'undefined') {
  // @ts-ignore
  global.CSS = { supports: () => true };
} else if (!CSS.supports) {
  // @ts-ignore
  CSS.supports = () => true;
}
