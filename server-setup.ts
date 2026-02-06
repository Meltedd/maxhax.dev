// Server-side localStorage polyfill for Next.js devtools compatibility
if (typeof window === 'undefined') {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const storageShim: Storage = {
    getItem(_key: string) { return null },
    setItem(_key: string, _value: string) {},
    removeItem(_key: string) {},
    clear() {},
    key(_index: number) { return null },
    length: 0,
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  Object.defineProperty(globalThis, 'localStorage', {
    value: storageShim,
    writable: false,
    configurable: false,
  })
}
