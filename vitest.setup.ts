import '@testing-library/jest-dom';

if (!window.CSS) {
  // @ts-expect-error jsdom polyfill
  window.CSS = {};
}

if (!window.CSS.supports) {
  window.CSS.supports = () => false;
}
