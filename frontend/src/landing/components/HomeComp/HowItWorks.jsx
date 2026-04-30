import React from "react";
import { motion } from "framer-motion";
import { assets } from '../../assets/assets';
import { ArrowDown } from "lucide-react";

const steps = [
  { num: "01", title: "Create Your Account", description: "Sign up in minutes with your business or personal details. Choose your account type and get started instantly.", img: assets.one },
  { num: "02", title: "Calculate Your Taxes", description: "Use our intelligent tax calculator to compute your tax obligations with precision and accuracy.", img: assets.two },
  { num: "03", title: "File & Stay Compliant", description: "Submit your returns, track deadlines, and receive expert consultation when you need it.", img: assets.three },
];

const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Soft blob */}
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] opacity-[0.04]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#38B88F" d="M39.9,-65.7C54.3,-60.5,70.7,-55.4,79.6,-44.1C88.5,-32.8,89.9,-15.3,87.4,1.4C84.9,18.1,78.5,34,68.6,46.5C58.7,59,45.3,68.1,30.8,73.6C16.3,79.1,0.7,81,-14.3,78.6C-29.3,76.2,-43.7,69.5,-55.6,59.3C-67.5,49.1,-76.9,35.4,-81.3,19.8C-85.7,4.2,-85.1,-13.3,-78.4,-28.1C-71.7,-42.9,-58.9,-55,-45.1,-60.4C-31.3,-65.8,-16.5,-64.5,-1.6,-61.7C13.3,-58.9,26.6,-54.6,39.9,-65.7Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[2.5rem] sm:text-[3rem] font-bold text-[#1a1a1a] leading-tight mb-4">
            How It <span className="text-[#038C2A]">Works</span>
          </h2>
          <p className="text-gray-500 text-base lg:text-lg max-w-xl mx-auto">
            Get started with TaxBuddy in three simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/3 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[#38B88F]/20 via-[#38B88F] to-[#38B88F]/20" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              <div className="relative inline-block mb-6">
                <img src={step.img} alt={step.title} className="w-40 h-40 object-contain mx-auto" />
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#038C2A] text-white flex items-center justify-center font-bold text-sm shadow-lg">
                  {step.num}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-8 h-8 text-[#38B88F]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
