import { useState, useRef } from 'react'
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
  CheckCircle
} from 'lucide-react'

// ===============================
// GOOGLE APPS SCRIPT URL
// ===============================

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwj7uVYryXnTfkGpIfXLu4CcLiwtapuM2Im3FbmmpBZxRlH6JzkWF1Ah8jyIEK7OKNS/exec'


export default function Contact() {

  const submittingRef = useRef(false)
  const fileInputRef = useRef(null)

  const [searchParams] = useSearchParams()

  const isPaymentForm =
    searchParams.get('type') === 'payment'

  // ===============================
  // FORM STATE
  // ===============================

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: '',
    paymentFile: null
  })

  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')


  // ===============================
  // INPUT CHANGE
  // ===============================

  const handleChange = (e) => {

    const { name, value, files } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }))

    setError('')
  }


  // ===============================
  // FILE → BASE64
  // ===============================

  const fileToBase64 = (file) => {

    return new Promise((resolve, reject) => {

      const reader = new FileReader()

      reader.readAsDataURL(file)

      reader.onload = () => {
        resolve(reader.result)
      }

      reader.onerror = (error) => {
        reject(error)
      }

    })
  }


  // ===============================
  // SUBMIT FORM
  // ===============================

  const handleSubmit = async (e) => {

    e.preventDefault()

    // Prevent double submission
    if (submittingRef.current) {
      return
    }

    submittingRef.current = true

    setLoading(true)
    setError('')
    setSent(false)

    try {

      // ===============================
      // REQUIRED FIELDS
      // ===============================

      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.phone.trim()
      ) {

        setError('Please fill all required fields.')
        return
      }


      // ===============================
      // PAYMENT FORM VALIDATION
      // ===============================

      if (isPaymentForm) {

        // Address required
        if (!form.address.trim()) {

          setError('Please enter your address.')
          return
        }


        // Screenshot required
        if (!form.paymentFile) {

          setError('Please upload your payment screenshot.')
          return
        }


        // File size limit: 5 MB
        if (
          form.paymentFile.size >
          5 * 1024 * 1024
        ) {

          setError(
            'Payment screenshot must be less than 5 MB.'
          )

          return
        }

      }


      // ===============================
      // FILE DATA
      // ===============================

      const fileData = isPaymentForm
        ? await fileToBase64(form.paymentFile)
        : ''


      // ===============================
      // PAYLOAD
      // ===============================

      const payload = {

        submissionId:
          typeof crypto !== 'undefined' &&
            crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`,

        type: isPaymentForm
          ? 'payment'
          : 'contact',

        name: form.name,
        email: form.email,
        phone: form.phone,

        address: isPaymentForm
          ? form.address
          : '',

        message: isPaymentForm
          ? ''
          : form.message,

        fileName: isPaymentForm
          ? form.paymentFile?.name || ''
          : '',

        fileType: isPaymentForm
          ? form.paymentFile?.type || ''
          : '',

        fileData: isPaymentForm
          ? fileData
          : ''

      }


      // ===============================
      // FORM BODY
      // ===============================

      const body = new URLSearchParams()

      body.append(
        'payload',
        JSON.stringify(payload)
      )


      // ===============================
      // SEND TO GOOGLE APPS SCRIPT
      // ===============================

      const response = await fetch(
        SCRIPT_URL,
        {
          method: 'POST',
          body: body
        }
      )


      const result = await response.text()

      console.log(
        'Apps Script Response:',
        result
      )


      // ===============================
      // SUCCESS
      // ===============================

      setSent(true)


      // ===============================
      // RESET FORM
      // ===============================

      setForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        message: '',
        paymentFile: null
      })


      // Clear file input
      if (fileInputRef.current) {

        fileInputRef.current.value = ''

      }

    } catch (error) {

      console.error(
        'Form submission error:',
        error
      )

      setError(
        'Something went wrong. Please try again.'
      )

    } finally {

      setLoading(false)

      submittingRef.current = false

    }

  }


  return (

    <div className="section-pad">

      <div className="container-x">


        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="mb-12">

          <h1 className="text-4xl font-bold mb-2">
            {isPaymentForm ? 'Payment Form' : 'Contact'}
          </h1>

          <p className="text-white/50">
            {isPaymentForm
              ? 'Complete the payment form and submit your payment details to get started.'
              : "Let's create together. Feel free to reach out for collaborations, projects or any inquiries."
            }
          </p>

        </div>


        <div className={isPaymentForm ? "grid lg:grid-cols-1 gap-10" : "grid lg:grid-cols-2 gap-10"}>

          {!isPaymentForm && (
            <div className="card p-8">

              <h3 className="font-semibold mb-6">
                Get In Touch
              </h3>

              <div className="space-y-5 mb-8">

                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <Mail
                    size={16}
                    className="text-accent"
                  />
                  NGanimationCr@gmail.com
                </div>

                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <Phone
                    size={16}
                    className="text-accent"
                  />
                  +91 74986 99607
                </div>

                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <MapPin
                    size={16}
                    className="text-accent"
                  />
                  Hinjewadi Phase I, Shivaji Chowk, Pune, Maharashtra – 411057, India
                </div>

              </div>

              <h4 className="text-sm font-medium mb-3">
                Follow Me
              </h4>

              <div className="flex gap-3 mt-4 text-white/60">

                <a
                  href="https://instagram.com/NGanimationCr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram
                    size={18}
                    className="hover:text-white cursor-pointer transition"
                  />
                </a>

                <a
                  href="https://youtube.com/@NGanimation_Cr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <Youtube
                    size={18}
                    className="hover:text-white cursor-pointer transition"
                  />
                </a>

                <a
                  href="https://threads.net/@NGanimationCr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Threads"
                >
                  <AtSign
                    size={18}
                    className="hover:text-white cursor-pointer transition"
                  />
                </a>

                <a
                  href="https://facebook.com/NGanimationCr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook
                    size={18}
                    className="hover:text-white cursor-pointer transition"
                  />
                </a>

                <a
                  href="https://www.linkedin.com/in/nandeshwar7678"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin
                    size={18}
                    className="hover:text-white cursor-pointer transition"
                  />
                </a>

                <a
                  href="https://github.com/nandeshwar7678"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github
                    size={18}
                    className="hover:text-white cursor-pointer transition"
                  />
                </a>

              </div>

            </div>
          )}

          {/* FORM */}
          <div className="card p-8">


            {/* FORM TITLE */}

            <h3 className="font-semibold mb-6">

              {isPaymentForm
                ? 'Payment Form'
                : 'Contact Us'}

            </h3>


            {/* ========================= */}
            {/* SUCCESS MESSAGE */}
            {/* ========================= */}

            {sent ? (

              <div className="py-10 text-center">


                <CheckCircle
                  size={55}
                  className="text-green-400 mx-auto mb-5"
                />


                <h3 className="text-xl font-semibold mb-2">

                  Details Submitted Successfully

                </h3>


                <p className="text-white/50">

                  {isPaymentForm

                    ? 'Thank you! Your payment details and screenshot have been submitted.'

                    : 'Thank you! Your message has been submitted successfully.'

                  }

                </p>


                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm text-accent hover:underline"
                >

                  Submit another response

                </button>


              </div>

            ) : (


              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >


                {/* ========================= */}
                {/* NAME */}
                {/* ========================= */}

                <div>

                  <label className="text-sm text-white/50 mb-1 block">
                    Full Name
                  </label>


                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />

                </div>


                {/* ========================= */}
                {/* EMAIL */}
                {/* ========================= */}

                <div>

                  <label className="text-sm text-white/50 mb-1 block">
                    Email Address
                  </label>


                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />

                </div>


                {/* ========================= */}
                {/* PHONE */}
                {/* ========================= */}

                <div>

                  <label className="text-sm text-white/50 mb-1 block">
                    Phone Number
                  </label>


                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />

                </div>


                {/* ========================= */}
                {/* PAYMENT ADDRESS */}
                {/* ========================= */}

                {isPaymentForm ? (

                  <div>

                    <label className="text-sm text-white/50 mb-1 block">
                      Address
                    </label>


                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                      required
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent resize-none"
                    />

                  </div>

                ) : (

                  /* ========================= */
                  /* NORMAL CONTACT QUERY */
                  /* ========================= */

                  <div>

                    <label className="text-sm text-white/50 mb-1 block">
                      Your Query
                    </label>


                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can I help you?"
                      required
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent resize-none"
                    />

                  </div>

                )}


                {/* ========================= */}
                {/* PAYMENT SCREENSHOT */}
                {/* ONLY PAYMENT FORM */}
                {/* ========================= */}

                {isPaymentForm && (

                  <div>

                    <label className="text-sm text-white/50 mb-2 block">
                      Payment Screenshot
                    </label>


                    <label
                      htmlFor="paymentFile"
                      className="border border-dashed border-white/15 rounded-lg p-5 bg-white/[0.03] hover:border-accent cursor-pointer transition block"
                    >

                      <div className="flex items-center gap-3">

                        <Upload
                          size={22}
                          className="text-accent"
                        />

                        <div>

                          <p className="text-sm font-medium">
                            Upload Payment Screenshot
                          </p>

                          <p className="text-xs text-white/40 mt-1">
                            JPG, PNG or WEBP • Maximum 5 MB
                          </p>

                        </div>

                      </div>


                      {/* SELECTED FILE */}

                      {form.paymentFile && (

                        <div className="mt-4 text-xs text-green-400">

                          ✓ {form.paymentFile.name}

                        </div>

                      )}

                    </label>


                    <input
                      ref={fileInputRef}
                      id="paymentFile"
                      type="file"
                      name="paymentFile"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleChange}
                      className="hidden"
                    />

                  </div>

                )}


                {/* ========================= */}
                {/* ERROR */}
                {/* ========================= */}

                {error && (

                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">

                    {error}

                  </div>

                )}


                {/* ========================= */}
                {/* SUBMIT */}
                {/* ========================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  {loading

                    ? 'Submitting...'

                    : isPaymentForm

                      ? 'Submit Payment Details'

                      : 'Send Message'

                  }

                </button>


              </form>

            )}

          </div>

        </div>

      </div>

    </div>

  )

}