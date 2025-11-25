import { ContactForm } from './contact-form'

export default function ContactPage() {
  return (
    <div className="min-h-screen max-w-[66ch] mobile:max-w-[min(66ch,50vw)]">
      <ContactForm />
    </div>
  )
}

export const dynamic = 'force-static'