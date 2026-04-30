import React, { useState, useRef } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL;

const Inputs = () => {
  const formRef = useRef()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send contact message to backend (which forwards via email)
      await axios.post(`${API}/api/users/contact`, formData)
      showToast("Message sent! We'll get back to you soon.", "success")
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to send message. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}

      <div className='bg-zero-five-black py-18 padding mt-12'>
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* CONTACT INFO SECTION */}
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
                <div className="bg-[#cdced0] rounded p-8 text-black">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6">
                      <img src={assets.phone} className='w-10' alt="Phone icon" />
                    </div>
                    <h3 className="text-xl font-medium mb-3">Phone Number</h3>
                    <p className='text-[16px] text-black'>+234 567-789-987</p>
                  </div>
                </div>

                <div className="bg-[#cdced0] rounded p-8 text-black">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6">
                      <img src={assets.email} className='w-10' alt="Email icon" />
                    </div>
                    <h3 className="text-xl font-medium mb-3">Email Address</h3>
                    <p className='text-[16px] break-all text-black'>scrsalade@gmail.com</p>
                  </div>
                </div>

                <div className="bg-[#cdced0] rounded p-8 text-black">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6">
                      <img src={assets.location} className='w-10' alt="Location icon" />
                    </div>
                    <h3 className="text-xl font-medium mb-3">Our Location</h3>
                    <p className='text-[16px] text-black'>1245 Ikoyi Phase 2, Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM SECTION */}
            <div className="order-1 lg:order-2 w-full">
              <div className=" ">
                <div className="mb-10">
                  <div className="flex gap-3 mb-4">
                    <h1 className='font-semibold'>Get In Touch</h1>
                  </div>
                  <p className='text-gray-700 leading-relaxed'>
                    We'd love to hear from you! Whether you have question about your account,
                    or need help with your taxes, or just want to share feedback, our team is
                    only a message away.
                  </p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className='space-y-3'>
                      <label htmlFor="name" className='block font-semibold text-gray-700'>
                        Name <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Your Name...'
                        className='w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                        required
                      />
                    </div>
                    <div className='space-y-3'>
                      <label htmlFor="email" className='block font-semibold text-gray-700'>
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='example@gmail.com'
                        className='w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <label htmlFor="subject" className='block font-semibold text-gray-700'>
                      Subject <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder='Title'
                      className='w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                      required
                    />
                  </div>

                  <div className='space-y-3'>
                    <label htmlFor="message" className='block font-semibold text-gray-700'>
                      Your Message <span className="text-primary">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder='Type here...'
                      rows={6}
                      className='w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-md text-lg transition-all duration-300 ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:shadow-lg'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-6 w-6 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Message...
                        </span>
                      ) : (
                        <span>
                          Send Message
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="text-center space-y-3">
                    <p className="text-gray-500 text-sm">
                      By submitting, you agree to our{' '}
                      <a href="#" className="text-secondary hover:underline font-medium">Privacy Policy</a>
                    </p>

                    <div className="text-xs text-gray-400">
                      <p>Having issues? Email us directly at: taxbuddynig@gmail.com</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Inputs