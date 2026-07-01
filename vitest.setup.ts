import '@testing-library/jest-dom';

// Polyfill CSS.supports for jsdom
if (typeof CSS === 'undefined') {
  // @ts-ignore
  global.CSS = { supports: () => true };
} else if (!CSS.supports) {
  // @ts-ignore
  CSS.supports = () => true;
}


// Polyfill constructable stylesheets used by designsystemet
declare global {
  interface Document {
    adoptedStyleSheets: CSSStyleSheet[];
  }
  interface ShadowRoot {
    adoptedStyleSheets: CSSStyleSheet[];
  }
}

if (typeof globalThis.CSSStyleSheet === 'undefined') {
  class CSSStyleSheetPolyfill {
    replaceSync(_cssText: string) {}
  }
  // @ts-expect-error test-only polyfill
  globalThis.CSSStyleSheet = CSSStyleSheetPolyfill;
}

const addAdoptedStyleSheets = (proto: object) => {
  const hasProp = Object.getOwnPropertyDescriptor(proto, 'adoptedStyleSheets');
  if (hasProp) return;

  let sheets: CSSStyleSheet[] = [];
  Object.defineProperty(proto, 'adoptedStyleSheets', {
    configurable: true,
    get: () => sheets,
    set: (value) => {
      sheets = Array.isArray(value) ? value : [];
    },
  });
};

addAdoptedStyleSheets(Document.prototype);
if (typeof ShadowRoot !== 'undefined') {
  addAdoptedStyleSheets(ShadowRoot.prototype);
}
