'use client'

import { useEffect, useState, useRef, useMemo } from 'react'

interface TimelineWrapperProps { children: React.ReactNode }
interface SectionInfo { year: string; start: number; end: number }

interface ScrollCallbacks {
  updateMeasurements: () => void
  updateStickyYear: () => void
  renderBinary: (scrollY: number) => void
  startDecayTail: () => void
  updateFromScroll: (scrollY: number, timestamp: number) => void
}

const TRANSITION_START_RATIO = 0.4
const SCROLL_SNAP = 50
const MAX_VELOCITY = 2.5
const DECAY_STEPS = 15
const DECAY_INTERVAL = 70
const DECAY_FACTOR = 0.88
const DECAY_DELAY = 80
const MIN_INTENSITY = 0.008
const VELOCITY_SCALE = 18
const MAX_MOMENTUM = 1.4
const SCRAMBLE_DURATION = 100

// LCG hash for deterministic pseudo-random binary generation
const lcgHash = (value: number): number => {
  const mixed = value ^ (value >>> 16)
  return (mixed * 1664525 + 1013904223) >>> 0
}

// Build base binary string from scroll position
const buildBinary = (scrollPos: number, numDigits: number): string => {
  const quantized = Math.floor(scrollPos / SCROLL_SNAP) * SCROLL_SNAP
  let binary = ''
  for (let segment = 0; binary.length < numDigits; segment++) {
    binary += lcgHash(quantized + segment * 500).toString(2).padStart(30, '0')
  }
  return binary.slice(0, numDigits)
}

// Apply scrambling to binary string based on intensity
const scrambleDigits = (
  base: string,
  intensity: number,
  scrollPos: number,
  docHeight: number,
  scrambledMap: Map<number, { value: string; time: number }>
): { display: string; indices: Set<number>; changed: number[] } => {
  const numDigits = base.length
  const chars = base.split('')
  const indices = new Set<number>()
  const changed: number[] = []
  const now = Date.now()
  const center = (docHeight > 0 ? scrollPos / docHeight : 0) * numDigits
  const width = 80 + intensity * 70

  // Apply existing scrambled values and clean expired
  scrambledMap.forEach((data, i) => {
    if (now - data.time < SCRAMBLE_DURATION) {
      chars[i] = data.value
      indices.add(i)
    } else {
      scrambledMap.delete(i)
    }
  })

  // Add new scrambles
  for (let i = 0; i < numDigits; i++) {
    const dist = Math.abs(i - center)
    if (dist >= width || scrambledMap.has(i)) continue
    const prob = intensity * (1 - dist / width) * 0.2
    if (Math.random() < prob) {
      const value = Math.random() > 0.5 ? '1' : '0'
      chars[i] = value
      indices.add(i)
      changed.push(i)
      scrambledMap.set(i, { value, time: now })
    }
  }

  return { display: chars.join(''), indices, changed }
}

export function TimelineWrapper({ children }: TimelineWrapperProps) {
  // UI state
  const [yearState, setYearState] = useState({ current: '', next: '', progress: 0 })
  const [displayString, setDisplayString] = useState('')
  const [scramblingIndices, setScramblingIndices] = useState<Set<number>>(new Set())
  const [numDigits, setNumDigits] = useState(295)
  const [digitChangeKeys, setDigitChangeKeys] = useState<number[]>(() => Array(295).fill(0))
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)

  // DOM refs
  const timelineRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  // Scroll state refs
  const scrollStateRef = useRef({
    stickyOffset: 0,
    sections: [] as SectionInfo[],
    docHeight: 0,
    lastY: 0,
    lastTime: Date.now(),
    momentum: 0,
    ticking: false,
    decayStep: 0,
  })
  const decayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrambledDigitsRef = useRef(new Map<number, { value: string; time: number }>())
  const isScramblingRef = useRef(false)
  const numDigitsRef = useRef(numDigits)
  numDigitsRef.current = numDigits

  // Stable ref for callbacks used in scroll/timeout closures.
  // Synced to latest closures inline below (same pattern as numDigitsRef).
  const cbRef = useRef<ScrollCallbacks>({
    updateMeasurements() {},
    updateStickyYear() {},
    renderBinary() {},
    startDecayTail() {},
    updateFromScroll() {},
  })

  // Odometer animation values
  const { currentLastDigit, nextLastDigit, digitOffset } = useMemo(() => ({
    currentLastDigit: yearState.current ? parseInt(yearState.current.slice(-1)) || 0 : 0,
    nextLastDigit: yearState.next ? parseInt(yearState.next.slice(-1)) || 0 : 0,
    digitOffset: yearState.progress * 100
  }), [yearState])

  // Session storage: read on mount, write after animation
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (sessionStorage.getItem('timelineSeen') === 'true') {
        setHasSeenAnimation(true)
        return
      }
    } catch { /* sessionStorage unavailable in some contexts */ }
    const timeout = setTimeout(() => {
      try { sessionStorage.setItem('timelineSeen', 'true') } catch { /* ignore */ }
      setHasSeenAnimation(true)
    }, 4000)
    return () => clearTimeout(timeout)
  }, [])

  // Measure sections and update doc height
  const updateMeasurements = () => {
    if (!timelineRef.current) return
    const state = scrollStateRef.current
    const sectionMap = new Map<string, SectionInfo>()

    timelineRef.current.querySelectorAll<HTMLElement>('.timeline-entry').forEach((entry) => {
      const year = entry.dataset.year
      if (!year) return
      const rect = entry.getBoundingClientRect()
      const top = rect.top + window.scrollY
      const bottom = rect.bottom + window.scrollY
      const existing = sectionMap.get(year)
      if (existing) {
        existing.start = Math.min(existing.start, top)
        existing.end = Math.max(existing.end, bottom)
      } else {
        sectionMap.set(year, { year, start: top, end: bottom })
      }
    })

    state.sections = Array.from(sectionMap.values())
    state.stickyOffset = stickyRef.current?.offsetHeight || 0
    state.docHeight = document.documentElement.scrollHeight - window.innerHeight
  }

  const updateStickyYear = () => {
    const { sections, stickyOffset, docHeight } = scrollStateRef.current
    if (!sections.length) return

    const scrollPos = window.scrollY + stickyOffset
    const maxScrollPos = docHeight + stickyOffset

    if (scrollPos <= sections[0].start) {
      setYearState({ current: sections[0].year, next: sections[0].year, progress: 0 })
      return
    }

    for (let i = 0; i < sections.length - 1; i++) {
      const curr = sections[i], next = sections[i + 1]
      if (!curr || !next || next.start <= curr.start) continue

      if (scrollPos >= curr.start && scrollPos < next.start) {
        const isLast = i === sections.length - 2
        const end = isLast ? Math.min(next.start, maxScrollPos) : next.start
        const range = end - curr.start
        if (range <= 1) {
          setYearState({ current: curr.year, next: next.year, progress: 1 })
          return
        }
        const ratio = isLast ? 0 : TRANSITION_START_RATIO
        const transitionStart = curr.start + range * ratio
        if (scrollPos < transitionStart) {
          setYearState({ current: curr.year, next: curr.year, progress: 0 })
          return
        }
        const progress = Math.min(Math.max((scrollPos - transitionStart) / Math.max(range * (1 - ratio), 1), 0), 1)
        setYearState({ current: curr.year, next: next.year, progress })
        return
      }
    }

    const last = sections[sections.length - 1]
    setYearState({ current: last.year, next: last.year, progress: 0 })
  }

  // Render binary string based on scroll position and intensity
  const renderBinary = (scrollY: number) => {
    const state = scrollStateRef.current
    const base = buildBinary(scrollY, numDigitsRef.current)

    if (state.momentum < MIN_INTENSITY) {
      setDisplayString(base)
      if (isScramblingRef.current) {
        setScramblingIndices(new Set())
        isScramblingRef.current = false
      }
      return
    }

    const result = scrambleDigits(base, state.momentum, scrollY, state.docHeight, scrambledDigitsRef.current)
    setDisplayString(result.display)
    setScramblingIndices(result.indices)
    isScramblingRef.current = result.indices.size > 0

    if (result.changed.length) {
      setDigitChangeKeys((prev) => {
        const keys = [...prev]
        result.changed.forEach((i) => { if (i < keys.length) keys[i]++ })
        return keys
      })
    }
  }

  // Decay tail
  const startDecayTail = () => {
    if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
    const state = scrollStateRef.current
    state.decayStep = 0

    const step = () => {
      state.momentum *= DECAY_FACTOR
      cbRef.current.renderBinary(state.lastY)

      if (++state.decayStep < DECAY_STEPS) {
        decayTimeoutRef.current = setTimeout(step, DECAY_INTERVAL)
      } else {
        state.momentum = 0
        setScramblingIndices(new Set())
        isScramblingRef.current = false
        cbRef.current.renderBinary(state.lastY)
        decayTimeoutRef.current = null
      }
    }

    decayTimeoutRef.current = setTimeout(step, DECAY_DELAY)
  }

  // Main scroll update pipeline
  const updateFromScroll = (scrollY: number, timestamp: number) => {
    const state = scrollStateRef.current
    const timeDelta = Math.max(timestamp - state.lastTime, 16)
    const scrollDelta = scrollY - state.lastY

    if (scrollDelta !== 0) {
      const velocity = scrollDelta / timeDelta
      const cappedVelocity = Math.sign(velocity) * Math.min(Math.abs(velocity), MAX_VELOCITY)
      const normalizedVelocity = Math.abs(cappedVelocity) * VELOCITY_SCALE
      state.momentum = Math.max(state.momentum, Math.min(normalizedVelocity, MAX_MOMENTUM))
      cbRef.current.startDecayTail()
    }

    state.lastY = scrollY
    state.lastTime = timestamp
    setParallaxOffset(scrollY * 0.4)
    cbRef.current.updateStickyYear()
    cbRef.current.renderBinary(scrollY)
  }

  // Sync callback refs every render (inline, not deferred like useEffect)
  cbRef.current.updateMeasurements = updateMeasurements
  cbRef.current.updateStickyYear = updateStickyYear
  cbRef.current.renderBinary = renderBinary
  cbRef.current.startDecayTail = startDecayTail
  cbRef.current.updateFromScroll = updateFromScroll

  // Calculate number of digits and setup scroll listeners
  useEffect(() => {
    if (typeof window === 'undefined') return

    const calculateDigits = () => {
      const entries = document.querySelectorAll('.timeline-entry')
      const binaryDigit = document.querySelector('.binary-digit') as HTMLElement
      if (!entries.length || !binaryDigit) return

      const lastEntry = entries[entries.length - 1] as HTMLElement
      const binaryLine = binaryDigit.parentElement
      if (!binaryLine) return

      const gap = parseFloat(getComputedStyle(binaryLine).gap) || 0
      const pixelsPerDigit = binaryDigit.offsetHeight + gap
      const lastEntryBottom = lastEntry.offsetTop + lastEntry.offsetHeight
      const buffer = window.innerWidth < 768 ? 0.35 : 0.38
      const calculated = Math.ceil((lastEntryBottom * (1 + buffer)) / pixelsPerDigit)

      if (calculated > 0 && calculated !== numDigitsRef.current) {
        setNumDigits(calculated)
        setDigitChangeKeys(Array(calculated).fill(0))
      }
    }

    const handleScroll = () => {
      const state = scrollStateRef.current
      if (!state.ticking) {
        requestAnimationFrame(() => {
          cbRef.current.updateFromScroll(window.scrollY, Date.now())
          state.ticking = false
        })
        state.ticking = true
      }
    }

    const handleResize = () => {
      cbRef.current.updateMeasurements()
      calculateDigits()
    }

    // Initial setup
    setTimeout(calculateDigits, 100)
    cbRef.current.updateMeasurements()
    const { sections } = scrollStateRef.current
    if (sections.length > 0) {
      setYearState({ current: sections[0].year, next: sections[1]?.year ?? sections[0].year, progress: 0 })
    }
    cbRef.current.updateFromScroll(window.scrollY, Date.now())

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
      scrambledDigitsRef.current.clear()
    }
  }, [])

  return (
    <div className={`timeline-wrapper ${hasSeenAnimation ? 'timeline-animation-seen' : ''}`}>
      {/* Sticky year indicator with odometer effect */}
      <div className="sticky-year-indicator" ref={stickyRef}>
        <span>{yearState.current.slice(0, -1)}</span>
        <span className="year-odometer">
          <span className="odometer-digits" style={{ transform: `translateY(${-digitOffset}%)` }}>
            <span className="odometer-digit">{currentLastDigit}</span>
            <span className="odometer-digit">{nextLastDigit}</span>
          </span>
        </span>
      </div>

      <div className="timeline" ref={timelineRef}>
        {/* Binary line display */}
        <div className="binary-line" style={{ transform: `translateY(-${parallaxOffset}px)` }}>
          {displayString.split('').map((digit, i) => (
            <span
              key={`${i}-${digitChangeKeys[i]}`}
              className={`binary-digit ${scramblingIndices.has(i) ? 'scrambling' : ''}`}
              style={{ animationDelay: `${(i % 10) * 0.015}s` }}
            >
              {digit}
            </span>
          ))}
        </div>

        {/* Gradients for timeline focus effect */}
        <div className="timeline-fade-top" />
        {children}
        <div className="timeline-fade-bottom" />
      </div>
    </div>
  )
}
