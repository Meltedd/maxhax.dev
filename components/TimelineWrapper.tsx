'use client'

import { useEffect, useState, useRef } from 'react'
import { useLatest } from '@/hooks/useLatest'

interface TimelineWrapperProps {
  children: React.ReactNode
}

interface SectionInfo {
  year: string
  start: number
  end: number
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

// Apply scrambling to binary string based on scroll momentum
const scrambleDigits = (
  base: string,
  intensity: number,
  scrollPos: number,
  docHeight: number,
  scrambledMap: Map<number, { value: string; time: number }>
): string => {
  const numDigits = base.length
  const chars = base.split('')
  const now = Date.now()
  const center = (docHeight > 0 ? scrollPos / docHeight : 0) * numDigits
  const width = 80 + intensity * 70

  // Apply existing scrambled values and clean expired
  scrambledMap.forEach((data, i) => {
    if (now - data.time < SCRAMBLE_DURATION) {
      chars[i] = data.value
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
      scrambledMap.set(i, { value, time: now })
    }
  }

  return chars.join('')
}

export function TimelineWrapper({ children }: TimelineWrapperProps) {
  // React-managed state (only values that affect JSX structure or text)
  const [yearState, setYearState] = useState({ current: '', next: '', progress: 0 })
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)

  // Only triggers a render when values actually change
  const setYearIfChanged = (current: string, next: string, progress: number) => {
    setYearState(prev => {
      if (prev.current === current && prev.next === next && prev.progress === progress) return prev
      return { current, next, progress }
    })
  }

  // DOM refs
  const timelineRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const binaryLineRef = useRef<HTMLDivElement>(null)
  const binarySpansRef = useRef<HTMLSpanElement[]>([])

  // Scroll state refs (never trigger React renders)
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

  // Odometer animation values — trivially cheap, no memo needed
  const currentLastDigit = yearState.current ? parseInt(yearState.current.slice(-1)) || 0 : 0
  const nextLastDigit = yearState.next ? parseInt(yearState.next.slice(-1)) || 0 : 0
  const digitOffset = yearState.progress * 100

  // Session storage: read on mount, write after animation
  useEffect(() => {
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
      setYearIfChanged(sections[0].year, sections[0].year, 0)
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
          setYearIfChanged(curr.year, next.year, 1)
          return
        }
        const ratio = isLast ? 0 : TRANSITION_START_RATIO
        const transitionStart = curr.start + range * ratio
        if (scrollPos < transitionStart) {
          setYearIfChanged(curr.year, curr.year, 0)
          return
        }
        const progress = Math.min(Math.max((scrollPos - transitionStart) / Math.max(range * (1 - ratio), 1), 0), 1)
        setYearIfChanged(curr.year, next.year, progress)
        return
      }
    }

    const last = sections[sections.length - 1]
    setYearIfChanged(last.year, last.year, 0)
  }

  // Update binary spans directly — no React render needed for this decorative element
  const renderBinary = (scrollY: number) => {
    const spans = binarySpansRef.current
    if (!spans.length) return
    const state = scrollStateRef.current
    const base = buildBinary(scrollY, spans.length)

    const display = state.momentum < MIN_INTENSITY
      ? base
      : scrambleDigits(base, state.momentum, scrollY, state.docHeight, scrambledDigitsRef.current)

    for (let i = 0; i < spans.length; i++) {
      if (spans[i].textContent !== display[i]) {
        spans[i].textContent = display[i]
      }
    }
  }

  // Decay tail — gradually reduces scramble intensity after scrolling stops
  const startDecayTail = () => {
    if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
    const state = scrollStateRef.current
    state.decayStep = 0

    const step = () => {
      state.momentum *= DECAY_FACTOR
      renderBinaryRef.current(state.lastY)

      if (++state.decayStep < DECAY_STEPS) {
        decayTimeoutRef.current = setTimeout(step, DECAY_INTERVAL)
      } else {
        state.momentum = 0
        renderBinaryRef.current(state.lastY)
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
      startDecayTailRef.current()
    }

    state.lastY = scrollY
    state.lastTime = timestamp

    if (binaryLineRef.current) {
      binaryLineRef.current.style.transform = `translateY(-${scrollY * 0.4}px)`
    }
    updateStickyYearRef.current()
    renderBinaryRef.current(scrollY)
  }

  // Stable refs that always point to the latest closure, avoiding stale captures in scroll/timeout callbacks.
  const updateMeasurementsRef = useLatest(updateMeasurements)
  const updateStickyYearRef = useLatest(updateStickyYear)
  const renderBinaryRef = useLatest(renderBinary)
  const startDecayTailRef = useLatest(startDecayTail)
  const updateFromScrollRef = useLatest(updateFromScroll)

  // Calculate number of digits and setup scroll listeners
  useEffect(() => {
    const syncSpans = () => {
      const container = binaryLineRef.current
      if (!container) return
      const entries = document.querySelectorAll('.timeline-entry')
      if (!entries.length) return

      // Need at least one span to measure digit height
      const existingSpans = binarySpansRef.current
      if (!existingSpans.length) {
        const seed = document.createElement('span')
        seed.className = 'binary-digit'
        seed.textContent = '0'
        container.appendChild(seed)
        existingSpans.push(seed)
      }

      const gap = parseFloat(getComputedStyle(container).gap) || 0
      const pixelsPerDigit = existingSpans[0].offsetHeight + gap
      if (pixelsPerDigit <= 0) return // font/CSS not ready — retry on next resize or rAF

      const lastEntry = entries[entries.length - 1] as HTMLElement
      const lastEntryBottom = lastEntry.offsetTop + lastEntry.offsetHeight
      const buffer = window.innerWidth < 768 ? 0.35 : 0.38
      const needed = Math.ceil((lastEntryBottom * (1 + buffer)) / pixelsPerDigit)
      if (needed <= 0 || needed === existingSpans.length) return

      // Add or remove spans to match needed count
      if (needed > existingSpans.length) {
        for (let i = existingSpans.length; i < needed; i++) {
          const span = document.createElement('span')
          span.className = 'binary-digit'
          span.textContent = '0'
          container.appendChild(span)
          existingSpans.push(span)
        }
      } else {
        while (existingSpans.length > needed) {
          const removed = existingSpans.pop()!
          container.removeChild(removed)
        }
      }
    }

    const handleScroll = () => {
      const state = scrollStateRef.current
      if (!state.ticking) {
        requestAnimationFrame(() => {
          updateFromScrollRef.current(window.scrollY, Date.now())
          state.ticking = false
        })
        state.ticking = true
      }
    }

    const handleResize = () => {
      updateMeasurementsRef.current()
      syncSpans()
    }

    // Defer initial measurements until after first paint so layout is settled
    setTimeout(syncSpans, 100)
    requestAnimationFrame(() => {
      updateMeasurementsRef.current()
      const { sections } = scrollStateRef.current
      if (sections.length > 0) {
        setYearIfChanged(sections[0].year, sections[1]?.year ?? sections[0].year, 0)
      }
      updateFromScrollRef.current(window.scrollY, Date.now())
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
      scrambledDigitsRef.current.clear()
      binarySpansRef.current = []
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
        {/* Binary line — spans managed imperatively via binarySpansRef */}
        <div className="binary-line" ref={binaryLineRef} />

        {/* Gradients for timeline focus effect */}
        <div className="timeline-fade-top" />
        {children}
        <div className="timeline-fade-bottom" />
      </div>
    </div>
  )
}
