'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { isRateLimited } from './rate-limit'

const MIN_SUBMIT_TIME_MS = 3000
const MAX_SUBJECT_LENGTH = 200
const MAX_MESSAGE_LENGTH = 5000
const MAX_EMAIL_LENGTH = 254 // RFC 5321
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SendResult = { success: true } | { success: false; error: string }

export async function sendContactEmail(
  senderEmail: string,
  subject: string,
  message: string,
  honeypot: string,
  renderTime: number
): Promise<SendResult> {
  if (honeypot.trim()) return { success: true }
  if (Date.now() - renderTime < MIN_SUBMIT_TIME_MS) return { success: true }

  const trimmedEmail = senderEmail.trim().toLowerCase()
  const trimmedSubject = subject.trim().slice(0, MAX_SUBJECT_LENGTH)
  const trimmedMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH)

  if (!trimmedEmail || trimmedEmail.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(trimmedEmail)) {
    return { success: false, error: 'Valid email required' }
  }

  if (!trimmedMessage) {
    return { success: false, error: 'Message is required' }
  }

  const contactEmail = process.env.CONTACT_EMAIL
  const apiKey = process.env.RESEND_API_KEY
  if (!contactEmail || !apiKey) {
    console.error('Missing CONTACT_EMAIL or RESEND_API_KEY environment variables')
    return { success: false, error: 'Server configuration error' }
  }

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim()
  if (await isRateLimited(ip)) {
    return { success: false, error: 'Too many requests. Please try again later.' }
  }

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: 'maxhax.dev <contact@maxhax.dev>',
      to: contactEmail,
      replyTo: trimmedEmail,
      subject: trimmedSubject || 'New message from contact form',
      text: `From: ${trimmedEmail}\n\n${trimmedMessage}`,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: 'Failed to send message' }
    }

    return { success: true }
  } catch (err) {
    console.error('Email send error:', err)
    return { success: false, error: 'Failed to send message' }
  }
}
