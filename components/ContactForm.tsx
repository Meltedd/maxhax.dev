'use client'

import { useState, useTransition } from 'react'
import cn from 'clsx'
import { sendContactEmail } from '@/app/contact/actions'

const MAX_MESSAGE_LENGTH = 5000

export function ContactForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (website.trim()) return
    if (!email.trim() || !message.trim() || isPending) return

    startTransition(async () => {
      const result = await sendContactEmail(email, subject, message)

      if (result.success) {
        setStatus('success')
        setEmail('')
        setMessage('')
        setSubject('')
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setErrorMsg(result.error)
        setTimeout(() => setStatus('idle'), 4000)
      }
    })
  }

  return (
    <div className="max-w-[min(66ch,90vw)] w-full">
      <div className="mb-[clamp(1.5rem,3vw,2.5rem)]">
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold text-rurikon-700 mb-[clamp(0.75rem,2vw,1.25rem)] tracking-tight eb-garamond-italic">
          Get in touch
        </h1>
        <p className="text-[clamp(0.95rem,1.8vw,1.125rem)] text-rurikon-600 font-serif">
          If you want to connect, I&apos;m easy to reach. Feel free to send me a message.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col border border-rurikon-border rounded bg-rurikon-50/30 w-full">
        <div className="border-b border-rurikon-border">
          <div className="px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)]">
            <label htmlFor="email" className="sr-only">Your email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-0 text-[clamp(1rem,1.8vw,1.125rem)] text-rurikon-600 font-serif bg-transparent border-none outline-none placeholder:italic eb-garamond-placeholder"
              placeholder="Your email"
              name="email"
              autoComplete="email"
              required
            />
            <nav aria-label="Social links" className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] text-rurikon-300 text-[clamp(0.85rem,1.5vw,0.96rem)] shrink-0">
              <a
                href="https://www.linkedin.com/in/maxhax"
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
                href="https://hackerone.com/0xmaxhax"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HackerOne"
                draggable={false}
                className="inline-flex items-center gap-[clamp(0.25rem,1vw,0.5rem)] underline decoration-1 underline-offset-[0.25em] eb-garamond-italic hover:text-rurikon-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[0.9em] w-[0.9em]">
                  <path d="M7.207 0c-.4836 0-.8717.0981-1.1683.3007-.3044.2003-.4592.4627-.4592.7798v21.809c0 .2766.1581.5277.4752.7609.315.2335.7031.3501 1.1664.3501.4427 0 .8306-.1166 1.1678-.3501.3352-.231.5058-.4843.5058-.761V1.0815c0-.319-.1623-.5769-.4893-.7813C8.0644.1018 7.6702 0 7.207 0zm9.5234 8.662c-.4836 0-.8717.0981-1.1683.3007l-4.439 2.7822c-.1988.1861-.2841.4687-.2473.855.0342.3826.2108.747.5238 1.0907.3145.346.6662.5626 1.0684.6547.3963.0899.6973.041.8962-.143l1.7551-1.0951v9.7817c0 .2767.1522.5278.4607.761.3007.2335.6873.3501 1.1504.3501.463 0 .863-.1166 1.1983-.3501.3371-.2332.5058-.4843.5058-.761V9.7381c0-.3193-.165-.577-.4898-.7754-.3252-.2026-.7288-.3007-1.2143-.3007z" />
                </svg>
                <span className="hidden lg:inline">HackerOne</span>
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

          <div className="px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] border-t border-rurikon-border/50">
            <label htmlFor="subject" className="sr-only">Subject:</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 min-w-0 text-[clamp(1rem,1.8vw,1.125rem)] text-rurikon-600 font-serif bg-transparent border-none outline-none placeholder:italic eb-garamond-placeholder"
              placeholder="Subject (optional)"
              name="subject"
              autoComplete="off"
              maxLength={200}
            />
            <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] shrink-0">
              {status === 'success' && (
                <span className="text-[clamp(0.85rem,1.5vw,1rem)] text-rurikon-300 font-serif italic">sent</span>
              )}
              {status === 'error' && (
                <span className="text-[clamp(0.85rem,1.5vw,1rem)] text-red-500 font-serif italic" role="alert" aria-live="polite">
                  {errorMsg}
                </span>
              )}
              {isPending && (
                <span className="text-[clamp(0.85rem,1.5vw,1rem)] text-rurikon-300 font-serif italic" role="status" aria-live="polite">
                  sending...
                </span>
              )}
            </div>
          </div>
        </div>

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

        <label htmlFor="message" className="sr-only">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type here…"
          className={cn(
            'resize-none bg-transparent border-none outline-none rounded',
            'min-h-[clamp(220px,32vw,460px)] px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)]',
            'text-[clamp(0.95rem,1.7vw,1rem)] text-rurikon-600 font-serif leading-normal eb-garamond-placeholder',
            'placeholder:text-rurikon-300 placeholder:italic',
            'cursor-text caret-rurikon-600 overflow-y-auto transition-all duration-300 ease-out',
          )}
          name="message"
          autoComplete="off"
          maxLength={MAX_MESSAGE_LENGTH}
          aria-describedby="message-length"
        />

        <div className="px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.25rem,0.8vw,0.375rem)] flex items-center justify-between border-t border-rurikon-border gap-[clamp(0.5rem,1.5vw,0.75rem)]">
          <div id="message-length" className="text-[clamp(0.85rem,1.5vw,1rem)] text-rurikon-300 font-serif italic">
            {message.length} characters
          </div>

          <button
            type="submit"
            disabled={!email.trim() || !message.trim() || isPending}
            className="group text-[clamp(0.9rem,1.6vw,1rem)] text-rurikon-600 hover:text-link-hover font-serif eb-garamond-italic transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-[clamp(0.2rem,0.8vw,0.25rem)]"
            aria-label={status === 'success' ? 'Message sent' : isPending ? 'Sending message' : 'Send message'}
          >
            <span className="inline-flex items-center transition-all duration-300 ease-out opacity-90" aria-hidden>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[0.95em] w-[0.95em] relative top-[0.125em]">
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2Zm-.4 3.25l-6.96 4.35a2 2 0 01-2.08 0L3.6 7.25a.75.75 0 11.8-1.26l6.96 4.35a.5.5 0 00.52 0L18.84 6a.75.75 0 11.76 1.25Z" />
              </svg>
            </span>
            <span>{status === 'success' ? 'sent' : isPending ? 'sending' : 'send'}</span>
            <span
              className={cn(
                'transition-all duration-300 ease-out opacity-0 -translate-x-2',
                status === 'idle' && !isPending && 'group-hover:opacity-100 group-hover:translate-x-0'
              )}
            >
              →
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}
