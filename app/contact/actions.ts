'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const CONTACT_EMAIL = process.env.CONTACT_EMAIL!

const MAX_SUBJECT_LENGTH = 200
const MAX_MESSAGE_LENGTH = 5000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SendResult = { success: true } | { success: false; error: string }

export async function sendContactEmail(
  senderEmail: string,
  subject: string,
  message: string
): Promise<SendResult> {
  const trimmedEmail = senderEmail.trim().toLowerCase()
  const trimmedSubject = subject.trim().slice(0, MAX_SUBJECT_LENGTH)
  const trimmedMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH)

  if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
    return { success: false, error: 'Valid email required' }
  }

  if (!trimmedMessage) {
    return { success: false, error: 'Message is required' }
  }

  if (!CONTACT_EMAIL || !process.env.RESEND_API_KEY) {
    console.error('Missing CONTACT_EMAIL or RESEND_API_KEY environment variables')
    return { success: false, error: 'Server configuration error' }
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
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
