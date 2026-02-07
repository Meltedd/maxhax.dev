import { ContactForm } from '@/components/ContactForm'

export default function ContactPage() {
  return (
    <div className="min-h-screen max-w-[66ch] mobile:max-w-[min(66ch,60vw)]">
      <ContactForm />
    </div>
  )
}

export const dynamic = 'force-static'