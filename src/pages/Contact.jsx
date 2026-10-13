
import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Linkedin,
  AtSign,
  Facebook,
  Github,
  Upload,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Copy,
  QrCode,
  Smartphone,
  X,
  ExternalLink,
} from 'lucide-react'

import paymentCharacter from '../assets/paymentChar.png'
import letsConnectCharacters from '../assets/letsConnect.jpg'

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwj7uVYryXnTfkGpIfXLu4CcLiwtapuM2Im3FbmmpBZxRlH6JzkWF1Ah8jyIEK7OKNS/exec'

// IMPORTANT:
// UPI_ID wahi hona chahiye jo aapke UPI app mein active ho.
// ACCOUNT_HOLDER ko payment app mein dikhne wale actual recipient name se match karein.
const UPI_ID = 'akashya7393@ybl'
const ACCOUNT_HOLDER = 'Nandeshwar'
const PAYMENT_NOTE = 'NGanimationCr Payment'

const isUpiConfigured =
  Boolean(UPI_ID.trim()) &&
  UPI_ID.trim() !== 'YOUR_UPI_ID@BANK'

const upiLink = `upi://pay?pa=${encodeURIComponent(
  UPI_ID.trim()
)}&pn=${encodeURIComponent(
  ACCOUNT_HOLDER
)}&tn=${encodeURIComponent(
  PAYMENT_NOTE
)}&cu=INR`

const qrImageUrl = isUpiConfigured
  ? `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=12&data=${encodeURIComponent(
      upiLink
    )}`
  : ''

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/NGanimationCr',
    Icon: Instagram,
    color: 'text-[#E4405F]',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@NGanimation_Cr',
    Icon: Youtube,
    color: 'text-red-500',
  },
  {
    label: 'Threads',
    href: 'https://threads.net/@NGanimationCr',
    Icon: AtSign,
    color: 'text-white',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/NGanimationCr',
    Icon: Facebook,
    color: 'text-blue-400',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nandeshwar7678',
    Icon: Linkedin,
    color: 'text-sky-400',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/nandeshwar7678',
    Icon: Github,
    color: 'text-white',
  },
]

const inputClass =
  'w-full min-w-0 rounded-xl border border-white/10 bg-black px-4 py-3 text-base text-white placeholder:text-white/30 outline-none transition duration-200 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/10 sm:text-sm'

const labelClass = 'mb-2 block text-sm font-medium text-white/75'

export default function Contact() {
  const submittingRef = useRef(false)
  const fileInputRef = useRef(null)
  const [searchParams] = useSearchParams()

  const isPaymentForm = searchParams.get('type') === 'payment'

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: '',
    paymentFile: null,
  })

  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [qrOpen, setQrOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = (e) => {
    const { name, value, files } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] || null : value,
    }))

    setError('')
  }

  // Clipboard API + fallback for browsers where clipboard access is blocked.
  const copyTextFallback = (text) => {
    const textarea = document.createElement('textarea')

    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    textarea.style.opacity = '0'

    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)

    let success = false

    try {
      success = document.execCommand('copy')
    } catch {
      success = false
    }

    document.body.removeChild(textarea)
    return success
  }

  const handleCopyUpi = async () => {
    setError('')
    setCopied(false)

    if (!isUpiConfigured) {
      setError('Please add your actual UPI ID in Contact.jsx.')
      return
    }

    let success = false

    try {
      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(UPI_ID.trim())
        success = true
      }
    } catch {
      success = false
    }

    if (!success) {
      success = copyTextFallback(UPI_ID.trim())
    }

    if (success) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } else {
      setError(
        `Automatic copy failed. Please select and copy this UPI ID manually: ${UPI_ID}`
      )
    }
  }

  const handlePaymentClick = (e) => {
    if (!isUpiConfigured) {
      e.preventDefault()
      setError('Please configure your actual UPI ID first.')
      return
    }

    setError('')
    // The browser/device must support UPI links and have a compatible app.
  }

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Unable to read screenshot'))
    })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (submittingRef.current) return

    setError('')
    setSent(false)

    // Validate before turning on the loading state.
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please fill all required fields.')
      return
    }

    if (isPaymentForm) {
      if (!form.address.trim()) {
        setError('Please enter your full address.')
        return
      }

      if (!form.paymentFile) {
        setError('Please upload your payment screenshot.')
        return
      }

      if (form.paymentFile.size > 5 * 1024 * 1024) {
        setError('Payment screenshot must be less than 5 MB.')
        return
      }

      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']

      if (!allowedTypes.includes(form.paymentFile.type)) {
        setError('Please upload a JPG, PNG or WEBP image.')
        return
      }
    }

    submittingRef.current = true
    setLoading(true)

    try {
      const fileData =
        isPaymentForm && form.paymentFile
          ? await fileToBase64(form.paymentFile)
          : ''

      const payload = {
        submissionId:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`,

        type: isPaymentForm ? 'payment' : 'contact',
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: isPaymentForm ? form.address.trim() : '',
        message: isPaymentForm ? '' : form.message.trim(),

        fileName: isPaymentForm ? form.paymentFile?.name || '' : '',
        fileType: isPaymentForm ? form.paymentFile?.type || '' : '',
        fileData: isPaymentForm ? fileData : '',
      }

      const body = new URLSearchParams()
      body.append('payload', JSON.stringify(payload))

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body,
      })

      const result = await response.text()
      console.log('Apps Script response:', result)

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`)
      }

      setSent(true)

      setForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        message: '',
        paymentFile: null,
      })

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (submitError) {
      console.error('Form submission error:', submitError)
      setError(
        'Submission failed. Please check your internet connection and try again.'
      )
    } finally {
      setLoading(false)
      submittingRef.current = false
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {/* PAGE HEADING */}
        <header className="mb-4 sm:mb-5 lg:mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-[#111111] px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-amber-300">
            <Sparkles size={14} />
            {isPaymentForm
              ? 'NGANIMATIONCR · PAYMENT'
              : 'NGANIMATIONCR · CONTACT'}
          </div>

          <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {isPaymentForm ? (
              <>
                Complete Your{' '}
                <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Payment
                </span>
              </>
            ) : (
              <>
                Let’s create{' '}
                <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  together.
                </span>
              </>
            )}
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-5 text-white/55 sm:text-base">
            {isPaymentForm
              ? 'Make your payment using UPI, then submit your details and payment screenshot.'
              : 'Reach out for collaborations, creative projects, brand advertisements or any other inquiry.'}
          </p>
        </header>

        <div
          className={
            isPaymentForm
              ? 'grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10'
              : 'grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10'
          }
        >
          {/* LEFT SIDE */}
          {isPaymentForm ? (
            <section className="min-w-0 space-y-5">
              <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-[#19150d] text-amber-300">
                    <QrCode size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Pay with UPI
                    </h2>
                    <p className="mt-1 text-xs text-white/45">
                      Scan the QR code or use your UPI app
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="text-sm text-white/60">
                      Recipient name
                    </span>
                    <span className="break-words text-right font-semibold text-white">
                      {ACCOUNT_HOLDER}
                    </span>
                  </div>

                  <div className="mb-4 border-t border-white/10" />

                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/45">
                    UPI ID
                  </p>

                  <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-[#101010] p-3">
                    <span className="min-w-0 flex-1 break-all text-sm font-semibold text-amber-300">
                      {UPI_ID}
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      disabled={!isUpiConfigured}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:border-amber-400/50 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Copy size={14} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <a
                    href={isUpiConfigured ? upiLink : undefined}
                    onClick={handlePaymentClick}
                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition ${
                      isUpiConfigured
                        ? 'bg-amber-400 text-black hover:bg-amber-300'
                        : 'cursor-not-allowed bg-white/10 text-white/40'
                    }`}
                  >
                    <Smartphone size={18} />
                    Pay using UPI app
                    <ExternalLink size={15} />
                  </a>

                  <p className="mt-3 text-center text-xs leading-5 text-white/40">
                    On mobile, this link may open a compatible UPI app.
                    If it does not open, scan the QR code or copy the UPI ID.
                  </p>
                </div>

                {/* QR CODE */}
                <div className="mt-5 rounded-2xl border border-white/10 bg-[#111111] p-4 text-center sm:p-5">
                  <p className="text-sm font-semibold text-white">
                    Scan to pay
                  </p>

                  {isUpiConfigured ? (
                    <button
                      type="button"
                      onClick={() => setQrOpen(true)}
                      className="mx-auto mt-4 block rounded-2xl bg-white p-3 transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400"
                      aria-label="View larger UPI payment QR code"
                    >
                      <img
                        src={qrImageUrl}
                        alt="UPI payment QR code"
                        className="h-44 w-44 object-contain sm:h-52 sm:w-52"
                      />
                    </button>
                  ) : (
                    <div className="mx-auto mt-4 flex h-48 max-w-xs items-center justify-center rounded-xl border border-dashed border-amber-400/30 p-5 text-sm leading-6 text-amber-200/80">
                      Add your actual UPI ID in Contact.jsx to generate the QR code.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => isUpiConfigured && setQrOpen(true)}
                    disabled={!isUpiConfigured}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-400/30 px-4 py-2.5 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <QrCode size={16} />
                    View QR Code
                  </button>

                  <p className="mx-auto mt-3 max-w-sm text-xs leading-5 text-white/40">
                    Open this page on a desktop and scan the QR code with
                    your phone’s UPI app. Verify the recipient before paying.
                  </p>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-3 text-xs leading-5 text-emerald-200/80">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                  <span>
                    Verify the recipient name and UPI ID inside your payment
                    app. Do not pay if the displayed details do not match
                    the intended recipient.
                  </span>
                </div>
              </div>

              {/* PAYMENT CHARACTER */}
              {/* <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 text-center sm:p-7">
                <img
                  src={paymentCharacter}
                  alt="NGanimationCr payment assistant"
                  className="mx-auto max-h-56 w-full max-w-[250px] object-contain"
                  loading="lazy"
                />

                <h2 className="mt-3 text-xl font-bold">
                  You’re one step away!
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/55">
                  Complete your payment, then submit your details and
                  payment screenshot.
                </p>
              </div> */}
            </section>
          ) : (
            <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[#101010] p-5 sm:p-8 lg:p-9">
              <img
                src={letsConnectCharacters}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-30"
              />

              <div className="pointer-events-none absolute inset-0 -z-10 bg-black/75" />

              <h2 className="mb-6 text-lg font-semibold">Get in touch</h2>

              <div className="space-y-5">
                <a
                  href="mailto:NGanimationCr@gmail.com"
                  className="flex min-w-0 items-start gap-3 text-sm text-white/70 transition hover:text-amber-300"
                >
                  <Mail size={18} className="mt-0.5 shrink-0 text-amber-300" />
                  <span className="break-all">NGanimationCr@gmail.com</span>
                  <ArrowUpRight size={15} className="ml-auto shrink-0 text-white/30" />
                </a>

                <a
                  href="tel:+917498699607"
                  className="flex items-center gap-3 text-sm text-white/70 transition hover:text-amber-300"
                >
                  <Phone size={18} className="shrink-0 text-amber-300" />
                  +91 74986 99607
                  <ArrowUpRight size={15} className="ml-auto shrink-0 text-white/30" />
                </a>

                <div className="flex items-start gap-3 text-sm leading-6 text-white/65">
                  {/* <MapPin size={18} className="mt-0.5 shrink-0 text-amber-300" /> */}
                 
<a
  href="https://www.google.com/maps/search/?api=1&query=Hinjewadi+Phase+I%2C+Shivaji+Chowk%2C+Pune%2C+Maharashtra+411057%2C+India"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Open NGanimationCr location in Google Maps"
  title="View location on Google Maps"
  className="group flex items-start gap-3 text-sm leading-6 text-white/65 transition-colors duration-300 hover:text-amber-300"
>
  <MapPin
    size={18}
    className="mt-0.5 shrink-0 text-amber-300 transition-transform duration-300 group-hover:scale-110"
  />

  <span>
    Hinjewadi Phase I, Shivaji Chowk, Pune,
    Maharashtra – 411057, India

    <span className="mt-1 block text-xs text-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      Open in Google Maps ↗
    </span>
  </span>

  <ArrowUpRight
    size={15}
    className="mt-0.5 ml-auto shrink-0 text-white/30 transition-colors group-hover:text-amber-300"
  />
</a>

                </div>
              </div>

              <h3 className="mb-3 mt-8 text-sm font-semibold text-white/80">
                Follow NGanimationCr
              </h3>

              <div className="flex flex-wrap gap-2">
                {socialLinks.map(({ label, href, Icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit NGanimationCr on ${label}`}
                    title={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-white/[0.05]"
                  >
                    <Icon size={18} className={color} />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* FORM */}
          <section className="min-w-0 rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 shadow-2xl shadow-black/30 sm:rounded-3xl sm:p-7 lg:p-9">
            <div className="mb-6 border-b border-white/[0.08] pb-5 sm:mb-7">
              <h2 className="text-lg font-semibold sm:text-xl">
                {isPaymentForm ? 'Payment details' : 'Send us a message'}
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-white/45">
                {isPaymentForm
                  ? 'After completing payment, fill in these details and upload your screenshot.'
                  : 'Tell us a little about your project and we’ll get back to you.'}
              </p>
            </div>

            {sent ? (
              <div className="py-10 text-center sm:py-14">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                  <CheckCircle size={34} className="text-emerald-300" />
                </div>

                <h3 className="text-xl font-semibold">
                  Details submitted successfully
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
                  {isPaymentForm
                    ? 'Thank you! Your payment details and screenshot have been submitted. This form does not verify the payment itself.'
                    : 'Thank you! Your message has been submitted successfully.'}
                </p>

                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-amber-300 transition hover:bg-white/[0.06]"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    required
                    className={inputClass}
                  />
                </div>

                {isPaymentForm ? (
                  <>
                    <div>
                      <label htmlFor="address" className={labelClass}>
                        Full address *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Enter your full address"
                        required
                        rows={3}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <div>
                      <label htmlFor="paymentFile" className={labelClass}>
                        Payment screenshot *
                      </label>

                      <label
                        htmlFor="paymentFile"
                        className="block cursor-pointer rounded-xl border border-dashed border-amber-400/30 bg-[#111111] p-4 transition hover:border-amber-400/70 hover:bg-[#17140e] sm:p-5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                            <Upload size={21} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">
                              {form.paymentFile
                                ? 'Screenshot selected'
                                : 'Upload payment screenshot'}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-white/40">
                              JPG, PNG or WEBP · Maximum 5 MB
                            </p>
                          </div>
                        </div>

                        {form.paymentFile && (
                          <p className="mt-3 break-all rounded-lg bg-emerald-400/[0.07] px-3 py-2 text-xs text-emerald-300">
                            ✓ {form.paymentFile.name}
                          </p>
                        )}
                      </label>

                      <input
                        ref={fileInputRef}
                        id="paymentFile"
                        type="file"
                        name="paymentFile"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleChange}
                        className="sr-only"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Your query *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help with your project?"
                      required
                      rows={5}
                      className={`${inputClass} resize-y`}
                    />
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="break-words rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 px-5 py-3.5 text-sm font-bold text-black transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? 'Submitting...'
                    : isPaymentForm
                      ? 'Submit payment details'
                      : 'Send message'}

                  {!loading && <ArrowUpRight size={17} />}
                </button>

                {isPaymentForm && (
                  <p className="text-center text-xs leading-5 text-white/35">
                    This form sends your details and screenshot. It does not
                    independently verify whether a payment was completed.
                  </p>
                )}
              </form>
            )}
          </section>
        </div>

        {isPaymentForm && (
          <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-white/35 lg:hidden">
            <ShieldCheck size={14} className="shrink-0" />
            <span>NGanimationCr payment details submission</span>
          </div>
        )}
      </div>

      {/* LARGE QR MODAL */}
      {qrOpen && isUpiConfigured && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setQrOpen(false)}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
            className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#101010] p-5 text-center shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQrOpen(false)}
              aria-label="Close QR code"
              className="absolute right-4 top-4 rounded-lg border border-white/10 p-2 text-white/70 transition hover:text-amber-300"
            >
              <X size={18} />
            </button>

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/20 bg-[#19150d] text-amber-300">
              <QrCode size={23} />
            </div>

            <h2 id="qr-modal-title" className="text-xl font-bold">
              Scan to Pay
            </h2>

            <p className="mt-2 text-sm text-white/50">
              Recipient:{' '}
              <span className="font-semibold text-white">
                {ACCOUNT_HOLDER}
              </span>
            </p>

            <div className="mx-auto mt-5 w-fit rounded-2xl bg-white p-3">
              <img
                src={qrImageUrl}
                alt="UPI payment QR code"
                className="h-64 w-64 max-w-full object-contain"
              />
            </div>

            <p className="mt-4 break-all text-sm font-semibold text-amber-300">
              {UPI_ID}
            </p>

            <button
              type="button"
              onClick={handleCopyUpi}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-amber-400/40 hover:text-amber-300"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy UPI ID'}
            </button>

            {error && (
              <p role="alert" className="mt-3 break-words text-xs text-red-300">
                {error}
              </p>
            )}

            <p className="mt-4 text-xs leading-5 text-white/40">
              Verify the recipient name and UPI ID in your payment app
              before confirming payment.
            </p>
          </section>
        </div>
      )}
    </main>
  )
}
