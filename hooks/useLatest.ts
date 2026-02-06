import { useRef } from 'react'

/** Keeps a ref whose `.current` is always the latest value, updated synchronously during render. */
export function useLatest<T>(value: T): { readonly current: T } {
  const ref = useRef(value)
  ref.current = value
  return ref
}
