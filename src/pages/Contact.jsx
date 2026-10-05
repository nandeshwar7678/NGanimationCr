import { useState, useRef } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
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

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
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
      // Validate required fields
      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.phone.trim() ||
        !form.address.trim()
      ) {
        setError('Please fill all required fields.')
        return
      }

      // Validate payment screenshot
      if (!form.paymentFile) {
        setError('Please upload your payment screenshot.')
        return
      }

      // File size limit: 5 MB
      if (form.paymentFile.size > 5 * 1024 * 1024) {
        setError('Payment screenshot must be less than 5 MB.')
        return
      }

      // Convert payment screenshot to Base64
      const fileData = await fileToBase64(form.paymentFile)

      const payload = {
        submissionId:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`,

        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,

        fileName: form.paymentFile.name,
        fileType: form.paymentFile.type,
        fileData: fileData
      }

      const body = new URLSearchParams()

      body.append('payload', JSON.stringify(payload))

      // Send only ONE request
      const response = await fetch(SCRIPT_URL, {
  method: 'POST',
  body: body
})

const result = await response.text()

console.log("Apps Script Response:", result)

      // Show success
      setSent(true)

      // Reset form
      setForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        paymentFile: null
      })

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error('Form submission error:', error)
      setError('Something went wrong. Please try again.')
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
            Contact
          </h1>

          <p className="text-white/50">
            Let's create together. Feel free to reach out for
            collaborations, projects or any inquiries.
          </p>

        </div>


        <div className="grid lg:grid-cols-2 gap-10">


          {/* ========================= */}
          {/* LEFT SIDE */}
          {/* ========================= */}

          <div className="card p-8">

            <h3 className="font-semibold mb-6">
              Get In Touch
            </h3>


            <div className="space-y-5 mb-8">


              {/* EMAIL */}

              <div className="flex items-center gap-3 text-white/70 text-sm">

                <Mail
                  size={16}
                  className="text-accent"
                />

                NGanimationCr@gmail.com

              </div>


              {/* PHONE */}

              <div className="flex items-center gap-3 text-white/70 text-sm">

                <Phone
                  size={16}
                  className="text-accent"
                />

                +91 74986 99607

              </div>


              {/* LOCATION */}

              <div className="flex items-center gap-3 text-white/70 text-sm">

                <MapPin
                  size={16}
                  className="text-accent"
                />

                India

              </div>


            </div>


            {/* SOCIAL */}

            <h4 className="text-sm font-medium mb-3">
              Follow Me
            </h4>


            <div className="flex gap-3 text-white/60">

              <Instagram
                size={18}
                className="hover:text-white cursor-pointer"
              />

              <Youtube
                size={18}
                className="hover:text-white cursor-pointer"
              />

              <Linkedin
                size={18}
                className="hover:text-white cursor-pointer"
              />

              <Twitter
                size={18}
                className="hover:text-white cursor-pointer"
              />

            </div>

          </div>


          {/* ========================= */}
          {/* FORM */}
          {/* ========================= */}

          <div className="card p-8">


            <h3 className="font-semibold mb-6">
              Send Your Details
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
                  Thank you! Your details and payment
                  screenshot have been submitted.
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
                {/* ADDRESS */}
                {/* ========================= */}

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


                {/* ========================= */}
                {/* PAYMENT SCREENSHOT */}
                {/* ========================= */}

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


                    {/* Selected file */}

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
                    : 'Submit Details'
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