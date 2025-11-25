import { ContactForm } from '@/components/ContactForm'

export default function ContactPage() {
  return (
    <div className="content-width">
      <ContactForm />
    </div>
  )
}

export const dynamic = 'force-static'