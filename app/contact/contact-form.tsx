'use client'

import { useEffect, useRef, useState } from 'react'

const EMAIL_OPEN_DELAY = 800
const RESET_DELAY = 2000
const RATE_LIMIT_WINDOW = 30000 // 30 seconds
const MAX_SUBJECT_LENGTH = 200
const MAX_MESSAGE_LENGTH = 2000
const MAX_URL_LENGTH = 6000
const CONTACT_EMAIL = 'REDACTED'

export function ContactForm() {
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [website, setWebsite] = useState('') // honeypot to deter bots
  const [isSaved, setIsSaved] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rateLimited, setRateLimited] = useState(false)
  
  const timeoutRefs = useRef<{ open?: ReturnType<typeof setTimeout>; reset?: ReturnType<typeof setTimeout>; rateLimit?: ReturnType<typeof setTimeout> }>({})

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRefs.current.open) {
        clearTimeout(timeoutRefs.current.open)
      }
      if (timeoutRefs.current.reset) {
        clearTimeout(timeoutRefs.current.reset)
      }
      if (timeoutRefs.current.rateLimit) {
        clearTimeout(timeoutRefs.current.rateLimit)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Abort if the honeypot is filled (likely a bot)
    if (website.trim()) return

    // Check rate limiting
    // Note: This is client-side only protection using sessionStorage, which can be cleared/reset.
    // This is acceptable for a mailto: form as there's no server-side processing, but users can bypass it.
    try {
      const lastSubmission = sessionStorage.getItem('contactFormLastSubmission')
      if (lastSubmission) {
        const timeSinceLastSubmission = Date.now() - parseInt(lastSubmission, 10)
        if (timeSinceLastSubmission < RATE_LIMIT_WINDOW) {
          setRateLimited(true)
          timeoutRefs.current.rateLimit = setTimeout(() => setRateLimited(false), RATE_LIMIT_WINDOW - timeSinceLastSubmission)
          return
        }
      }
    } catch {
      // sessionStorage may not be available, continue anyway
    }

    // Runtime input validation and truncation
    let validatedSubject = subject.trim()
    let validatedMessage = message.trim()

    if (!validatedMessage) return

    // Truncate subject if needed
    if (validatedSubject.length > MAX_SUBJECT_LENGTH) {
      validatedSubject = validatedSubject.slice(0, MAX_SUBJECT_LENGTH)
    }

    // Truncate message if needed
    if (validatedMessage.length > MAX_MESSAGE_LENGTH) {
      validatedMessage = validatedMessage.slice(0, MAX_MESSAGE_LENGTH)
    }

    // Validate URL length
    let encodedSubject = encodeURIComponent(validatedSubject)
    let encodedMessage = encodeURIComponent(validatedMessage)
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodedSubject}&body=${encodedMessage}`
    
    if (mailtoUrl.length > MAX_URL_LENGTH) {
      // Truncate message to fit within URL limit
      const baseUrlLength = `mailto:${CONTACT_EMAIL}?subject=${encodedSubject}&body=`.length
      const maxMessageLength = MAX_URL_LENGTH - baseUrlLength
      
      if (maxMessageLength > 0) {
        // Estimate: encoded length is roughly 1-3x original, use conservative 2x
        const estimatedLength = Math.floor(maxMessageLength / 2)
        let truncatedMessage = validatedMessage.slice(0, estimatedLength)
        let testEncoded = encodeURIComponent(truncatedMessage)
        let testUrl = `mailto:${CONTACT_EMAIL}?subject=${encodedSubject}&body=${testEncoded}`
        
        // Fine-tune if still too long
        while (testUrl.length > MAX_URL_LENGTH && truncatedMessage.length > 0) {
          truncatedMessage = truncatedMessage.slice(0, -10)
          testEncoded = encodeURIComponent(truncatedMessage)
          testUrl = `mailto:${CONTACT_EMAIL}?subject=${encodedSubject}&body=${testEncoded}`
        }
        
        validatedMessage = truncatedMessage
        encodedMessage = testEncoded
      } else {
        // Subject is too long, truncate both
        const baseLength = `mailto:${CONTACT_EMAIL}?subject=&body=`.length
        const availableLength = MAX_URL_LENGTH - baseLength
        validatedSubject = validatedSubject.slice(0, Math.floor(availableLength / 2))
        validatedMessage = validatedMessage.slice(0, Math.floor(availableLength / 2))
        encodedSubject = encodeURIComponent(validatedSubject)
        encodedMessage = encodeURIComponent(validatedMessage)
      }
    }

    // Show saved effect
    setIsSaved(true)
    
    // Store submission timestamp for rate limiting
    try {
      sessionStorage.setItem('contactFormLastSubmission', Date.now().toString())
    } catch {
      // sessionStorage may not be available, continue anyway
    }
    
    // Open email client after a brief delay
    timeoutRefs.current.open = setTimeout(() => {
      try {
        const finalUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(validatedSubject)}&body=${encodeURIComponent(validatedMessage)}`
        window.location.href = finalUrl
      } catch {
        // Fallback: show email address
        setError(CONTACT_EMAIL)
        setIsSaved(false)
      }
    }, EMAIL_OPEN_DELAY)
    
    // Reset saved state
    timeoutRefs.current.reset = setTimeout(() => {
      setIsSaved(false)
      setMessage('')
      setSubject('')
    }, RESET_DELAY)
  }

  return (
    <div className="max-w-[min(66ch,90vw)] w-full">
      {/* Page context */}
      <div className="mb-[clamp(1.5rem,3vw,2.5rem)]">
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold text-rurikon-700 mb-[clamp(0.75rem,2vw,1.25rem)] tracking-tight eb-garamond-italic">
          Get in touch
        </h1>
        <p className="text-[clamp(0.95rem,1.8vw,1.125rem)] text-rurikon-600 font-serif">
          If you want to connect, I&apos;m easy to reach. Feel free to send me a message.
        </p>

        {/* moved socials into form header */}
      </div>

      {/* Compact contact form */}
      <div className="flex flex-col">
        {/* Subtle container around textarea */}
        <form onSubmit={handleSubmit} className="flex flex-col relative border border-rurikon-border rounded bg-rurikon-50/30 w-full">
          {/* Minimal header */}
          <div className="px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.25rem,0.8vw,0.375rem)] flex items-center justify-between border-b border-rurikon-border gap-[clamp(0.5rem,1.5vw,0.75rem)]">
            <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] min-w-0 flex-1">
              <label htmlFor="subject" className="text-[clamp(0.9rem,1.6vw,1rem)] text-rurikon-600 font-serif italic sr-only">
                Subject:
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-[clamp(1rem,1.8vw,1.125rem)] text-rurikon-600 font-serif bg-transparent border-none outline-none placeholder:italic eb-garamond-placeholder min-w-0 w-full"
                placeholder="Subject"
                name="subject"
                autoComplete="off"
                maxLength={200}
                aria-label="Email subject"
              />
            </div>
            
            <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] shrink-0">
              {isSaved && (
                <span className="text-[clamp(0.85rem,1.5vw,1rem)] text-rurikon-300 font-serif italic">
                  saved
                </span>
              )}
              {error && (
                <span className="text-[clamp(0.85rem,1.5vw,1rem)] text-rurikon-600 font-serif italic" role="alert" aria-live="polite">
                  {error}
                </span>
              )}
              {rateLimited && (
                <span className="text-[clamp(0.85rem,1.5vw,1rem)] text-rurikon-300 font-serif italic" role="status" aria-live="polite">
                  please wait
                </span>
              )}
              <nav aria-label="Social links" className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] text-rurikon-300 text-[clamp(0.85rem,1.5vw,0.96rem)]">
                <a
                  href="https://www.linkedin.com/in/max-harari-b35231359/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  draggable={false}
                  className="inline-flex items-center gap-[clamp(0.25rem,1vw,0.5rem)] underline decoration-1 underline-offset-[0.25em] eb-garamond-italic hover:text-rurikon-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[0.9em] w-[0.9em]">
                    <path d="M20.451 20.452h-3.554v-5.569c0-1.329-.024-3.038-1.852-3.038-1.853 0-2.136 1.447-2.136 2.943v5.664H9.355V9h3.414v1.561h.048c.476-.9 1.637-1.852 3.366-1.852 3.6 0 4.267 2.369 4.267 5.451v6.292zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.116 20.452H3.554V9h3.562v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                  <span className="hidden lg:inline">LinkedIn</span>
                </a>
                <span className="hidden lg:inline text-rurikon-200">·</span>
                <a
                  href="https://github.com/Meltedd"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  draggable={false}
                  className="inline-flex items-center gap-[clamp(0.25rem,1vw,0.5rem)] underline decoration-1 underline-offset-[0.25em] eb-garamond-italic hover:text-rurikon-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[0.9em] w-[0.9em]">
                    <path fillRule="evenodd" d="M12 .5C5.648.5.5 5.648.5 12c0 5.086 3.292 9.395 7.865 10.914.576.106.788-.25.788-.555 0-.274-.01-1-.016-1.962-3.199.696-3.874-1.542-3.874-1.542-.524-1.333-1.281-1.689-1.281-1.689-1.046-.714.079-.7.079-.7 1.157.082 1.767 1.188 1.767 1.188 1.028 1.762 2.697 1.253 3.352.958.104-.745.402-1.253.73-1.541-2.553-.29-5.238-1.277-5.238-5.682 0-1.255.448-2.28 1.184-3.085-.119-.291-.513-1.462.112-3.048 0 0 .966-.309 3.167 1.178a10.98 10.98 0 0 1 2.884-.388c.979.005 1.965.132 2.884.388 2.2-1.487 3.165-1.178 3.165-1.178.627 1.586.233 2.757.114 3.048.737.805 1.182 1.83 1.182 3.085 0 4.416-2.69 5.387-5.254 5.673.414.353.782 1.047.782 2.11 0 1.524-.014 2.752-.014 3.126 0 .307.208.667.796.553C20.215 21.392 23.5 17.083 23.5 12 23.5 5.648 18.352.5 12 .5Z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden lg:inline">GitHub</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Honeypot field (hidden from users) */}
          <div aria-hidden="true" className="sr-only">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type here…"
            className={`resize-none bg-transparent border-none outline-none text-[clamp(0.95rem,1.7vw,1rem)] text-rurikon-600 font-serif placeholder:text-rurikon-300 placeholder:italic transition-all duration-300 ease-out px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] leading-relaxed cursor-text rounded placeholder:text-[clamp(0.95rem,1.7vw,1rem)] overflow-y-auto eb-garamond-placeholder`}
            style={{ 
              // Maintain a stable aspect ratio relative to width across breakpoints (flatter)
              minHeight: 'clamp(220px, 32vw, 460px)',
              caretColor: '#45403a',
              lineHeight: '1.5'
            }}
            name="message"
            autoComplete="off"
            maxLength={2000}
            aria-label="Message content"
            aria-describedby="message-length"
          />
          
          {/* Compact footer */}
          <div className="px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.25rem,0.8vw,0.375rem)] flex items-center justify-between border-t border-rurikon-border gap-[clamp(0.5rem,1.5vw,0.75rem)]">
            <div id="message-length" className="text-[clamp(0.85rem,1.5vw,1rem)] text-rurikon-300 font-serif italic" aria-live="polite">
              {message.length} characters
            </div>
            
            <button
              type="submit"
              disabled={!message.trim() || isSaved || rateLimited}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="text-[clamp(0.9rem,1.6vw,1rem)] text-rurikon-600 hover:text-[#B85252] font-serif eb-garamond-italic transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-[clamp(0.2rem,0.8vw,0.25rem)]"
              aria-label={isSaved ? 'Message sent' : rateLimited ? 'Please wait before sending again' : 'Send message'}
            >
              <span className={`inline-flex items-center transition-all duration-300 ease-out opacity-90`} aria-hidden>
                {/* Mail icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[0.95em] w-[0.95em] relative top-[0.125em]">
                  <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2Zm-.4 3.25l-6.96 4.35a2 2 0 01-2.08 0L3.6 7.25a.75.75 0 11.8-1.26l6.96 4.35a.5.5 0 00.52 0L18.84 6a.75.75 0 11.76 1.25Z" />
                </svg>
              </span>
              <span>{isSaved ? 'sent' : 'send'}</span>
              <span className={`transition-all duration-300 ease-out ${isHovered && !isSaved ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                →
              </span>
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}

