// Server-side localStorage polyfill for Next.js devtools compatibility
if (typeof window === 'undefined') {
  const storageShim: Storage = {
    getItem(_key: string) { return null },
    setItem(_key: string, _value: string) {},
    removeItem(_key: string) {},
    clear() {},
    key(_index: number) { return null },
    length: 0,
  }

  Object.defineProperty(globalThis, 'localStorage', {
    value: storageShim,
    writable: false,
    configurable: false,
  })
}
