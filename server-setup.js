// Server-side localStorage polyfill for Next.js devtools compatibility
// This runs before any Next.js code
/* eslint-env node */
/* global global */
if (typeof window === 'undefined' && typeof global !== 'undefined') {
  const storageShim = {
    getItem: function() { return null },
    setItem: function() {},
    removeItem: function() {},
    clear: function() {},
    key: function() { return null },
    get length() { return 0 }
  }

  Object.defineProperty(global, 'localStorage', {
    value: storageShim,
    writable: false,
    configurable: false
  })

  Object.defineProperty(globalThis, 'localStorage', {
    value: storageShim,
    writable: false,
    configurable: false
  })
}
