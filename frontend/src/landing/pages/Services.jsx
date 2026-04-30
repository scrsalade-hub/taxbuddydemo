import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target, FileCheck, ShieldCheck, User, Building2, Calculator, ArrowRight, CheckCircle2
} from "lucide-react";

const services = [
  { icon: Target, title: "Tax Planning", description: "Strategic tax planning to minimize your liability while maximizing savings. We analyze your financial situation and create a customized tax strategy.", features: ["Year-round tax strategy", "Deduction optimization", "Entity structure advice"] },
  { icon: FileCheck, title: "Tax Filing & Compliance", description: "Complete tax filing services ensuring you meet all deadlines and requirements. We handle all the paperwork so you can focus on your business.", features: ["Annual tax returns", "Monthly VAT filings", "Compliance monitoring"] },
  { icon: ShieldCheck, title: "Tax Audit Support", description: "Professional representation during tax audits. Our experts will guide you through the entire audit process and ensure your rights are protected.", features: ["Audit preparation", "Documentation support", "FIRS liaison"] },
  { icon: User, title: "Personal Tax Consulting", description: "Expert guidance for individual taxpayers. From employment income to investment returns, we help you navigate personal tax obligations.", features: ["Personal tax returns", "Investment tax advice", "Estate planning"] },
  { icon: Building2, title: "Business Tax Strategy", description: "Comprehensive tax strategies for businesses of all sizes. We help structure your operations for optimal tax efficiency.", features: ["Corporate structuring", "Transfer pricing", "Tax incentive claims"] },
  { icon: Calculator, title: "VAT & PAYE Management", description: "End-to-end management of VAT and PAYE obligations. From registration to monthly filings, we ensure complete compliance.", features: ["VAT registration & filing", "PAYE calculations", "WHT compliance"] },
];

const whyUs = [
  "Certified tax professionals with FIRS experience",
  "Up-to-date with latest Nigerian tax regulations",
  "Personalized solutions for every client",
  "Transparent pricing with no hidden fees",
  "Secure and confidential data handling",
  "Ongoing support throughout the year",
];

const Services = () => {
  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <section className="bg-[#F8FFF8] py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] opacity-[0.06]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#38B88F" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90,-17.9,88.5,-2.9C87,12.1,81.4,26.5,72.6,38.7C63.8,50.9,51.8,60.9,38.5,68.2C25.2,75.5,10.6,80.1,-3.4,86.2C-17.4,92.3,-30.9,99.9,-43.3,93.8C-55.7,87.7,-67,68,-74.6,50.1C-82.2,32.2,-86.1,16.1,-84.8,1.1C-83.5,-13.9,-77,-27.8,-67.8,-39.4C-58.6,-51,-46.7,-60.3,-34.2,-68.2C-21.7,-76.1,-8.6,-82.6,4.7,-91.3C18,-100,36,-111,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] font-bold text-[#1a1a1a] leading-tight mb-4">
              Our <span className="text-[#038C2A]">Services</span>
            </h1>
            <p className="text-gray-500 text-base lg:text-lg max-w-2xl mx-auto">
              Comprehensive tax solutions designed to simplify compliance and maximize your savings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:border-[#38B88F]/20 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F8FFF8] flex items-center justify-center mb-6 group-hover:bg-[#038C2A] transition-colors">
                  <service.icon className="w-7 h-7 text-[#038C2A] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-[#38B88F] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28 bg-[#0a2e1d] relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] opacity-[0.05]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M39.9,-65.7C54.3,-60.5,70.7,-55.4,79.6,-39.8C86.9,-25.3,89.9,-15.3,87.4,1.4C84.9,18.1,78.5,34,68.6,46.5C58.7,59,45.3,68.5,32.3,74.6C19.1,81.1,4.3,83,-14.3,78.6C-29.3,76.2,-43.7,69.5,-55.6,59.3C-67.5,49.1,-76.9,35.4,-81.3,19.8C-85.7,4.2,-85.1,-0.3,-82.8,-14.2C-79.7,-28.1,-69.7,-40.7,-58.3,-49.8C-46.9,-58.9,-34.1,-64.5,-21.1,-68.1C-8.1,-71.7,0.7,-73.3,14.7,-71.2C28.7,-69.1,42.3,-63.2,54.3,-54.3C66.3,-45.4,76.7,-33.5,81.4,-19.8C86.1,-6.1,85.1,9.7,79.6,23.5C74.1,37.3,64.1,49.1,52.3,58.3C40.5,67.5,26.9,74.1,12.3,77.1C-2.3,80.1,-17.9,79.5,-32.3,74.8C-46.7,70.1,-59.9,61.3,-69.7,49.1C-79.5,36.9,-85.9,21.3,-86.3,5.6C-86.7,-10.1,-81.1,-25.9,-71.4,-38.5C-61.7,-51.1,-47.9,-60.5,-34.1,-65.7C-20.3,-70.9,-6.5,-71.9,7.1,-72.3C20.7,-72.7,34.1,-72.5,39.9,-65.7Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-[2.5rem] sm:text-[3rem] font-bold text-white leading-tight mb-6">
                Why Choose <span className="text-[#38B88F]">TaxBuddy?</span>
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                We combine technology with expertise to deliver the best tax solutions for Nigerian businesses and individuals.
              </p>
              <ul className="space-y-4">
                {whyUs.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#38B88F]/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#38B88F]" />
                    </div>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-10">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { num: "500+", label: "Clients Served" },
                    { num: "99%", label: "Compliance Rate" },
                    { num: "15+", label: "Years Experience" },
                    { num: "24/7", label: "Support Available" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 rounded-2xl bg-white/5">
                      <p className="text-3xl font-bold text-[#38B88F]">{stat.num}</p>
                      <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F8FFF8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-4">
            Ready to simplify your taxes?
          </h2>
          <p className="text-gray-500 mb-8">
            Get started today and experience hassle-free tax management.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-[#038C2A] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#026b21] transition-colors"
          >
            Get Started For Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
