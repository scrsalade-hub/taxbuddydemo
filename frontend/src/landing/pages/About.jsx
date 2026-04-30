import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {assets} from "../../landing/assets/assets"
import { Target, Award, Users, Shield, ArrowRight, Quote } from "lucide-react";

const teamMembers = [
  { name: "Abdur-Rahim Abddus-Salam", role: "Frontend & Backend Developer", img: assets.saldev },
  { name: " Adeboye Emmanuel", role: "Backend & Mobile App Developer", img: assets.adeboye },
  { name: "Sodiq Abdullah", role: "Product Designer", img: assets.abdullah },
  
];

const values = [
  { icon: Target, title: "Accuracy", description: "We ensure every calculation is precise and compliant with the latest regulations." },
  { icon: Shield, title: "Integrity", description: "We operate with complete transparency and ethical standards in all our dealings." },
  { icon: Users, title: "Client First", description: "Your success is our priority. We tailor solutions to meet your unique needs." },
  { icon: Award, title: "Excellence", description: "We continuously improve our services to deliver the best outcomes for our clients." },
];

const testimonials = [
  { text: "TaxBuddy transformed how we handle taxes. Their platform is intuitive and the team is incredibly supportive. Filing has never been easier.", name: "Grace Okafor", role: "CEO, Greenfield Logistics" },
  { text: "The consultation service was top-notch. They helped us save significantly on our tax liability while staying fully compliant.", name: "Michael Obi", role: "CFO, Prime Holdings Ltd" },
  { text: "As a startup founder, TaxBuddy made tax compliance simple. The automated reminders and expert support are game-changers.", name: "Aisha Bello", role: "Founder, TechNova Africa" },
];

const About = () => {
  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <section className="bg-[#F8FFF8] py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.05]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#38B88F" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90,-17.9,88.5,-2.9C87,12.1,81.4,26.5,72.6,38.7C63.8,50.9,51.8,60.9,38.5,68.2C25.2,75.5,10.6,80.1,-3.4,86.2C-17.4,92.3,-30.9,99.9,-43.3,93.8C-55.7,87.7,-67,68,-74.6,50.1C-82.2,32.2,-86.1,16.1,-84.8,1.1C-83.5,-13.9,-77,-27.8,-67.8,-39.4C-58.6,-51,-46.7,-60.3,-34.2,-68.2C-21.7,-76.1,-8.6,-82.6,4.7,-91.3C18,-100,36,-111,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] font-bold text-[#1a1a1a] leading-tight mb-4">
              About <span className="text-[#038C2A]">Us</span>
            </h1>
            <p className="text-gray-500 text-base lg:text-lg max-w-2xl mx-auto">
              We are on a mission to simplify tax management for every Nigerian
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block bg-[#F8FFF8] text-[#038C2A] px-4 py-2 rounded-full text-sm font-medium mb-6">
                Our Mission & Core Values
              </span>
              <h2 className="text-[2rem] sm:text-[2.5rem] font-bold text-[#1a1a1a] leading-tight mb-6">
                Making Tax Management
                <br />
                <span className="text-[#038C2A]">Simple for Everyone</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                TaxBuddy was founded with a clear vision: to eliminate the complexity and stress of tax management for Nigerian businesses and individuals. We believe that understanding and complying with tax obligations should not require a degree in accounting.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Our platform combines cutting-edge technology with deep tax expertise to deliver accurate calculations, timely reminders, and expert consultation — all in one place. Whether you are a freelancer, a small business owner, or a large corporation, TaxBuddy has the tools you need to stay compliant and optimize your tax position.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: "500+", label: "Clients Nationwide" },
                  { num: "₦2k+", label: "Taxes Optimized" },
                  { num: "1", label: "Years Combined Experience" },
                  { num: "99%", label: "Client Satisfaction" },
                ].map((s, i) => (
                  <div key={i} className="bg-[#F8FFF8] rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-[#038C2A]">{s.num}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=700&h=500&fit=crop&q=80"
                alt="TaxBuddy Team"
                className="rounded-3xl shadow-2xl w-full object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-5 border border-gray-50">
                <p className="text-3xl font-bold text-[#038C2A]">2025</p>
                <p className="text-sm text-gray-500">Year Founded</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-[#F8FFF8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-[2rem] sm:text-[2.5rem] font-bold text-[#1a1a1a] leading-tight mb-4">
              Our <span className="text-[#038C2A]">Values</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              The principles that guide everything we do at TaxBuddy
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F8FFF8] flex items-center justify-center mx-auto mb-5">
                  <v.icon className="w-7 h-7 text-[#038C2A]" />
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-[2rem] sm:text-[2.5rem] font-bold text-[#1a1a1a] leading-tight mb-4">
              Meet Our <span className="text-[#038C2A]">Team</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Experienced professionals dedicated to simplifying your tax experience
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center group"
              >
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#038C2A]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-base font-bold text-[#1a1a1a]">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-[#0a2e1d] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] opacity-[0.04]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M39.9,-65.7C54.3,-60.5,70.7,-55.4,79.6,-39.8C86.9,-25.3,89.9,-15.3,87.4,1.4C84.9,18.1,78.5,34,68.6,46.5C58.7,59,45.3,68.5,32.3,74.6C19.1,81.1,4.3,83,-14.3,78.6C-29.3,76.2,-43.7,69.5,-55.6,59.3C-67.5,49.1,-76.9,35.4,-81.3,19.8C-85.7,4.2,-85.1,-0.3,-82.8,-14.2C-79.7,-28.1,-69.7,-40.7,-58.3,-49.8C-46.9,-58.9,-34.1,-64.5,-21.1,-68.1C-8.1,-71.7,0.7,-73.3,14.7,-71.2C28.7,-69.1,42.3,-63.2,54.3,-54.3C66.3,-45.4,76.7,-33.5,81.4,-19.8C86.1,-6.1,85.1,9.7,79.6,23.5C74.1,37.3,64.1,49.1,52.3,58.3C40.5,67.5,26.9,74.1,12.3,77.1C-2.3,80.1,-17.9,79.5,-32.3,74.8C-46.7,70.1,-59.9,61.3,-69.7,49.1C-79.5,36.9,-85.9,21.3,-86.3,5.6C-86.7,-10.1,-81.1,-25.9,-71.4,-38.5C-61.7,-51.1,-47.9,-60.5,-34.1,-65.7C-20.3,-70.9,-6.5,-71.9,7.1,-72.3C20.7,-72.7,34.1,-72.5,39.9,-65.7Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-[2rem] sm:text-[2.5rem] font-bold text-white leading-tight mb-4">
              What Our <span className="text-[#38B88F]">Clients Say</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <Quote className="w-8 h-8 text-[#38B88F] mb-4" />
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{t.text}</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-[#F8FFF8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-4">
            Simple process, great results
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Join hundreds of Nigerian businesses that trust TaxBuddy for their tax needs.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-[#038C2A] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#026b21] transition-colors"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
