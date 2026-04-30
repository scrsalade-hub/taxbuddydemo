import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Inputs from '../components/ContactComp/Inputs';
import { Phone, Mail, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="pt-[72px]">
      {/* Hero with background image */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Background image - African business professionals */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&h=600&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a2e1d]/95 via-[#0a2e1d]/85 to-[#0a2e1d]/70" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Homepage</Link>
              <span>/</span>
              <span className="text-white">Contact Us</span>
            </div>
            <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] font-bold text-white leading-tight mb-4">
              Contact <span className="text-[#38B88F]">Us</span>
            </h1>
            <p className="text-gray-300 text-base lg:text-lg max-w-xl">
              We are here to help. Reach out to us for any inquiries, support, or partnership opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Phone, title: "Phone Number", detail: "+234 567-789-987", sub: "Mon - Sat, 9am - 6pm" },
              { icon: Mail, title: "Email Address", detail: "scrsalade@gmail.com", sub: "We reply within 24 hours" },
              { icon: MapPin, title: "Our Location", detail: "1245 Ikoyi Phase 2, Lagos", sub: "Nigeria" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F8FFF8] rounded-2xl p-8 text-center border border-[#38B88F]/10"
              >
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <item.icon className="w-7 h-7 text-[#038C2A]" />
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">{item.title}</h3>
                <p className="text-[#038C2A] font-semibold text-sm">{item.detail}</p>
                <p className="text-gray-500 text-xs mt-1">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <Inputs />

      {/* Google Map */}
      <section className="h-[400px] lg:h-[500px] mt-8">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31708.53663932871!2d3.4161527!3d6.4499999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf4c4c1c9e2c7%3A0x7f8c5c5c5c5c5c5c!2sIkoyi%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(20%)" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="TaxBuddy Office Location"
        />
      </section>
    </div>
  );
};

export default Contact;
