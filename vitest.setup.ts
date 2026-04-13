import '@testing-library/jest-dom';

// Polyfill CSS.supports for jsdom
if (typeof CSS === 'undefined') {
  // @ts-ignore
  global.CSS = { supports: () => true };
} else if (!CSS.supports) {
  // @ts-ignore
  CSS.supports = () => true;
}
