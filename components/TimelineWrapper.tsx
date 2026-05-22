'use client'

import { useEffect, useRef } from 'react'

interface TimelineWrapperProps {
  children: React.ReactNode
  initialYear: string
}

interface SectionRef {
  year: string
  offset: number
}

// Year interpolation
const TRANSITION_START_RATIO = 0.4

// Binary pattern
const SCROLL_SNAP = 50

// Parallax
const PARALLAX_FACTOR = 0.4

// Scramble momentum
const VELOCITY_SCALE = 18
const MAX_MOMENTUM = 1.4
const MIN_INTENSITY = 0.008

// Scramble decay
const DECAY_DELAY = 80
const DECAY_STEPS = 15
const DECAY_INTERVAL = 70
const DECAY_FACTOR = 0.88
const SCRAMBLE_DURATION = 100

// Scramble spatial
const SCRAMBLE_WIDTH_BASE = 80
const SCRAMBLE_WIDTH_GAIN = 70
const SCRAMBLE_PROB_SCALE = 0.2

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(n, hi))

const lcgHash = (value: number): number => {
  const mixed = value ^ (value >>> 16)
  return (mixed * 1664525 + 1013904223) >>> 0
}

const buildBinary = (scrollPos: number, numDigits: number): string => {
  const quantized = Math.floor(scrollPos / SCROLL_SNAP) * SCROLL_SNAP
  let binary = ''
  for (let segment = 0; binary.length < numDigits; segment++) {
    binary += lcgHash(quantized + segment * 500).toString(2).padStart(30, '0')
  }
  return binary.slice(0, numDigits)
}

export function TimelineWrapper({ children, initialYear }: TimelineWrapperProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const binaryRailRef = useRef<HTMLDivElement>(null)
  const binaryLineRef = useRef<HTMLDivElement>(null)
  const bottomFadeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let sections: SectionRef[] = []
    const scrambleMap = new Map<number, { value: string; time: number }>()
    const columns = Array.from(
      stickyRef.current!.querySelectorAll<HTMLElement>('.odometer-digits')
    ).map((digits) => {
      const pair = digits.querySelectorAll<HTMLElement>('.odometer-digit')
      return { digits, current: pair[0], next: pair[1] }
    })
    let currentYear = initialYear
    let nextYear = initialYear
    let yearProgress = 0
    let lastY = window.scrollY
    let lastTime = performance.now()
    let momentum = 0
    let lastRenderedQ = -1
    let railDigitCount = 1
    let reduceMotion = false
    let decayTimeoutId: ReturnType<typeof setTimeout> | null = null
    let scrollRafId: number | null = null
    let layoutRafId: number | null = null

    const setYear = (current: string, next: string, progress: number) => {
      if (currentYear === current && nextYear === next && yearProgress === progress) return
      const currentChanged = currentYear !== current
      const nextChanged = nextYear !== next
      for (let i = 0; i < current.length; i++) {
        const col = columns[i]
        if (currentChanged) col.current.textContent = current[i]
        if (nextChanged) col.next.textContent = next[i]
        // Keep matching digits at 0, only changed digits need to move.
        const p = current[i] === next[i] ? 0 : progress
        col.digits.style.setProperty('--year-progress', String(p))
      }
      currentYear = current
      nextYear = next
      yearProgress = progress
    }

    const updateStickyYear = () => {
      if (!sections.length) return

      const scrollY = window.scrollY
      const stickyOffset = stickyRef.current?.offsetHeight || 0
      const scrollPos = scrollY + stickyOffset
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight
      const maxReachable = maxScrollY + stickyOffset

      const firstStart = sections[0].offset
      const lastStart = sections[sections.length - 1].offset

      let pos = scrollPos
      if (lastStart > maxReachable && maxReachable > firstStart) {
        const frac = clamp((scrollPos - firstStart) / (maxReachable - firstStart), 0, 1)
        pos = firstStart + frac * (lastStart - firstStart)
      }

      if (pos <= firstStart) {
        setYear(sections[0].year, sections[0].year, 0)
        return
      }

      for (let i = 0; i < sections.length - 1; i++) {
        const curr = sections[i], next = sections[i + 1]
        if (pos >= curr.offset && pos < next.offset) {
          const isLast = i === sections.length - 2
          const range = next.offset - curr.offset
          if (range <= 1) {
            setYear(curr.year, next.year, 1)
            return
          }
          const ratio = isLast ? 0 : TRANSITION_START_RATIO
          const transitionStart = curr.offset + range * ratio
          if (pos < transitionStart) {
            setYear(curr.year, curr.year, 0)
            return
          }
          const progress = clamp((pos - transitionStart) / Math.max(range * (1 - ratio), 1), 0, 1)
          setYear(curr.year, next.year, progress)
          return
        }
      }

      const last = sections[sections.length - 1]
      setYear(last.year, last.year, 0)
    }

    const applyScramble = (scrollY: number, numDigits: number, now: number) => {
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight
      const center = (maxScrollY > 0 ? scrollY / maxScrollY : 0) * numDigits
      const width = SCRAMBLE_WIDTH_BASE + momentum * SCRAMBLE_WIDTH_GAIN

      scrambleMap.forEach((data, i) => {
        if (now - data.time >= SCRAMBLE_DURATION) scrambleMap.delete(i)
      })
      for (let i = 0; i < numDigits; i++) {
        const dist = Math.abs(i - center)
        if (dist >= width || scrambleMap.has(i)) continue
        const prob = momentum * (1 - dist / width) * SCRAMBLE_PROB_SCALE
        if (Math.random() < prob) {
          scrambleMap.set(i, { value: Math.random() > 0.5 ? '1' : '0', time: now })
        }
      }
    }

    const renderBinary = (scrollY: number, now: number) => {
      const sourceY = reduceMotion ? 0 : scrollY
      const q = reduceMotion ? 0 : Math.floor(sourceY / SCROLL_SNAP) * SCROLL_SNAP
      const active = !reduceMotion && momentum >= MIN_INTENSITY
      if (!active && q === lastRenderedQ) return
      lastRenderedQ = active ? -1 : q

      const base = buildBinary(sourceY, railDigitCount)
      if (active) applyScramble(scrollY, railDigitCount, now)
      else scrambleMap.clear()

      const chars: string[] = []
      for (let i = 0; i < railDigitCount; i++) {
        chars.push(scrambleMap.get(i)?.value ?? base[i])
      }
      const text = chars.join('\n')
      const line = binaryLineRef.current!
      if (line.textContent !== text) line.textContent = text
    }

    const startDecayTail = () => {
      if (reduceMotion) return
      if (decayTimeoutId) clearTimeout(decayTimeoutId)
      let decayStep = 0

      const step = () => {
        momentum *= DECAY_FACTOR
        renderBinary(lastY, performance.now())

        if (++decayStep < DECAY_STEPS) {
          decayTimeoutId = setTimeout(step, DECAY_INTERVAL)
        } else {
          momentum = 0
          renderBinary(lastY, performance.now())
          decayTimeoutId = null
        }
      }

      decayTimeoutId = setTimeout(step, DECAY_DELAY)
    }

    const renderFrame = (scrollY: number, now: number) => {
      const dt = Math.max(now - lastTime, 16)
      const dy = scrollY - lastY

      if (!reduceMotion && dy !== 0) {
        const speed = Math.abs(dy) / dt
        momentum = Math.max(momentum, Math.min(speed * VELOCITY_SCALE, MAX_MOMENTUM))
        startDecayTail()
      }

      lastY = scrollY
      lastTime = now

      updateStickyYear()
      const parallaxY = reduceMotion ? 0 : -scrollY * PARALLAX_FACTOR
      binaryLineRef.current!.style.setProperty('--parallax-y', `${parallaxY}px`)
      if (Math.abs(dy) > 2) {
        bottomFadeRef.current!.style.opacity = dy > 0 ? '0' : '1'
      }
      renderBinary(scrollY, now)
    }

    const buildSectionRefs = (entries: HTMLElement[]) => {
      const seen = new Set<string>()
      const refs: SectionRef[] = []
      const scrollY = window.scrollY
      entries.forEach((el) => {
        const year = el.dataset.year
        if (year && !seen.has(year)) {
          seen.add(year)
          refs.push({ year, offset: el.getBoundingClientRect().top + scrollY })
        }
      })
      sections = refs
    }

    const syncLayout = () => {
      const timeline = timelineRef.current
      const rail = binaryRailRef.current
      const line = binaryLineRef.current
      if (!timeline || !rail || !line) return

      const entries = Array.from(timeline.querySelectorAll<HTMLElement>('.timeline-entry'))
      buildSectionRefs(entries)

      let contentBottom = 0
      for (const entry of entries) {
        contentBottom = Math.max(contentBottom, entry.offsetTop + entry.offsetHeight)
      }
      const railContentHeight = contentBottom || rail.offsetHeight
      rail.style.setProperty('--binary-rail-content-height', `${railContentHeight}px`)

      const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const maxParallaxTravel = reduceMotion ? 0 : maxScrollY * PARALLAX_FACTOR
      const railHeight = rail.getBoundingClientRect().height
      const requiredTextHeight = Math.max(0, railHeight - line.offsetTop + maxParallaxTravel)
      const computedLineHeight = parseFloat(getComputedStyle(line).lineHeight)
      const digitPitch = Number.isFinite(computedLineHeight) && computedLineHeight > 0
        ? computedLineHeight
        : 20
      const nextRailDigitCount = Math.max(1, Math.ceil(requiredTextHeight / digitPitch))

      if (nextRailDigitCount !== railDigitCount) {
        railDigitCount = nextRailDigitCount
        scrambleMap.clear()
      }
      lastRenderedQ = -1
      renderFrame(window.scrollY, performance.now())
    }

    const scheduleLayoutSync = () => {
      if (layoutRafId !== null) cancelAnimationFrame(layoutRafId)
      layoutRafId = requestAnimationFrame(() => {
        layoutRafId = null
        syncLayout()
      })
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        scrollRafId = requestAnimationFrame(() => {
          scrollRafId = null
          renderFrame(window.scrollY, performance.now())
          ticking = false
        })
        ticking = true
      }
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotion = motionQuery.matches
    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches
      momentum = 0
      scrambleMap.clear()
      if (decayTimeoutId) {
        clearTimeout(decayTimeoutId)
        decayTimeoutId = null
      }
      lastRenderedQ = -1
      syncLayout()
    }

    const resizeObserver = new ResizeObserver(scheduleLayoutSync)
    resizeObserver.observe(timelineRef.current!)

    let disposed = false
    void document.fonts.ready.then(() => {
      if (!disposed) scheduleLayoutSync()
    })
    scheduleLayoutSync()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', scheduleLayoutSync)
    motionQuery.addEventListener('change', onMotionPreferenceChange)

    return () => {
      disposed = true
      resizeObserver.disconnect()
      if (scrollRafId !== null) cancelAnimationFrame(scrollRafId)
      if (layoutRafId !== null) cancelAnimationFrame(layoutRafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', scheduleLayoutSync)
      motionQuery.removeEventListener('change', onMotionPreferenceChange)
      if (decayTimeoutId) clearTimeout(decayTimeoutId)
    }
  }, [initialYear])

  return (
    <div className="timeline-wrapper">
      <div className="sticky-year-indicator" ref={stickyRef}>
        {Array.from(initialYear).map((digit, i) => (
          <span key={i} className="year-odometer">
            <span className="odometer-digits">
              <span className="odometer-digit">{digit}</span>
              <span className="odometer-digit">{digit}</span>
            </span>
          </span>
        ))}
      </div>

      <div className="timeline" ref={timelineRef}>
        <div className="binary-rail" ref={binaryRailRef} aria-hidden="true">
          <div className="binary-line" ref={binaryLineRef} />
        </div>

        <div className="timeline-fade-top" />
        {children}
        <div className="timeline-fade-bottom" ref={bottomFadeRef} />
      </div>
    </div>
  )
}
