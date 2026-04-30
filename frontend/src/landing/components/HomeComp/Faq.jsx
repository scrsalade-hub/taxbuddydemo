import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  { q: "What is TaxBuddy and how does it work?", a: "TaxBuddy is an intelligent tax platform designed for Nigerian taxpayers. We offer automated tax calculations, expert consultations, filing assistance, and compliance monitoring. Simply create an account, enter your business details, and our system will guide you through every step." },
  { q: "Is TaxBuddy approved by the FIRS?", a: "Yes, TaxBuddy operates in full compliance with the Federal Inland Revenue Service (FIRS) guidelines. Our tax calculations are regularly updated to reflect current Nigerian tax laws and regulations." },
  { q: "What types of taxes can I calculate?", a: "TaxBuddy supports all major Nigerian tax types including Company Income Tax (CIT), Value Added Tax (VAT), Personal Income Tax (PAYE), Withholding Tax (WHT), Capital Gains Tax, and Stamp Duties." },
  { q: "How accurate are the tax calculations?", a: "Our tax calculator uses the latest FIRS-approved formulas and tax rates. We regularly update our system to ensure 100% accuracy with current Nigerian tax legislation." },
  { q: "Can I get help with tax filing?", a: "Absolutely! Our expert consultants can guide you through the entire filing process. You can book a one-on-one consultation directly through the platform." },
  { q: "Is my data secure on TaxBuddy?", a: "We use bank-level encryption and security protocols to protect your data. All information is stored securely and is never shared with third parties without your consent." },
  { q: "What if I have a tax audit?", a: "TaxBuddy provides full audit support. Our experts can help you prepare documentation, represent you during the audit process, and ensure you meet all compliance requirements." },
];

const Faq = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[2.5rem] sm:text-[3rem] font-bold text-[#1a1a1a] leading-tight mb-4">
            Frequently Asked <span className="text-[#038C2A]">Questions</span>
          </h2>
          <p className="text-gray-500 text-base">
            Find answers to common questions about TaxBuddy
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-100 rounded-2xl overflow-hidden hover:border-[#38B88F]/30 transition-colors"
            >
              <button
                onClick={() => setOpenIdx(openIdx === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-[15px] font-semibold text-[#1a1a1a] pr-4">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: openIdx === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIdx === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-[#F8FFF8] rounded-3xl p-10 border border-[#38B88F]/10"
        >
          <div className="w-14 h-14 rounded-full bg-[#038C2A]/10 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-7 h-7 text-[#038C2A]" />
          </div>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">
            Still Have Questions?
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Our team is happy to help. Reach out to us and we will get back to you as soon as possible.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#038C2A] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#026b21] transition-colors"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
