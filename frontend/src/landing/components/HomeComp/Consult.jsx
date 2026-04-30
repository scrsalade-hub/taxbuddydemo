import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

const Consult = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#F8FFF8] relative overflow-hidden">
      {/* Soft SVG decoration */}
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] opacity-[0.06]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#38B88F" d="M47.7,-73.2C61.5,-67.3,72.3,-54.3,79.6,-39.8C86.9,-25.3,90.7,-9.3,88.3,5.6C85.9,20.5,77.3,34.3,67.2,46.3C57.1,58.3,45.5,68.5,32.3,74.8C19.1,81.1,4.3,83.5,-9.6,81.4C-23.5,79.3,-36.5,72.7,-47.8,63.4C-59.1,54.1,-68.7,42.1,-75.4,28.5C-82.1,14.9,-85.9,-0.3,-82.8,-14.2C-79.7,-28.1,-69.7,-40.7,-58.3,-49.8C-46.9,-58.9,-34.1,-64.5,-21.1,-68.1C-8.1,-71.7,4.1,-73.3,16.5,-74.2C28.9,-75.1,41.5,-75.3,47.7,-73.2Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[2.5rem] sm:text-[3rem] font-bold text-[#1a1a1a] leading-tight mb-6">
              Need Expert Tax
              <br />
              <span className="text-[#038C2A]">Consultation?</span>
            </h2>
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8 max-w-lg">
              Our certified tax professionals are ready to help you navigate complex tax matters. Book a consultation and get personalized advice for your business.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-[#038C2A] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#026b21] transition-all shadow-lg shadow-[#038C2A]/20"
              >
                Book a Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+234567789987"
                className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl text-sm font-semibold hover:border-[#038C2A] hover:text-[#038C2A] transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white-150 rounded-xl shadow-sm p-8 border border-green-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#F8FFF8] flex items-center justify-center">
                  <Phone className="w-7 h-7 text-[#038C2A]" />
                </div>
                <div>
                  <p className="text-md font-medium text-primary">Call us today</p>
                  <p className="text-xl font-bold text-[#1a1a1a]">+234 567 789 987</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Monday - Friday", value: "9:00 AM - 6:00 PM" },
                  { label: "Saturday", value: "10:00 AM - 4:00 PM" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-gray-150">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="text-[#1a1a1a] font-medium text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Consult;
