import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Award, Headphones } from "lucide-react";
import { assets } from '../../assets/assets';

/* Soft floating SVG blobs */
const Blob = ({ className, color }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      fill={color}
      d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90,-17.9,88.5,-2.9C87,12.1,81.4,26.5,72.6,38.7C63.8,50.9,51.8,60.9,38.5,68.2C25.2,75.5,10.6,80.1,-3.4,86.2C-17.4,92.3,-30.9,99.9,-43.3,93.8C-55.7,87.7,-67,68,-74.6,50.1C-82.2,32.2,-86.1,16.1,-84.8,1.1C-83.5,-13.9,-77,-27.8,-67.8,-39.4C-58.6,-51,-46.7,-60.3,-34.2,-68.2C-21.7,-76.1,-8.6,-82.6,4.7,-91.3C18,-100,36,-111,44.7,-76.4Z"
      transform="translate(100 100)"
    />
  </svg>
);

/* Animated wave SVG for heading background */
const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg
      className="absolute bottom-0 left-0 w-full"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      style={{ height: "60%" }}
    >
      <defs>
        <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8f5f0" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#d4edda" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e8f5f0" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <motion.path
        fill="url(#waveGrad1)"
        d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        animate={{
          d: [
            "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            "M0,128L48,154.7C96,181,192,235,288,234.7C384,235,480,181,576,165.3C672,149,768,171,864,192C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

/* Animated wave line decoration */
const AnimatedWaveLine = () => (
  <svg viewBox="0 0 500 50" className="w-full h-8 mt-2" preserveAspectRatio="none">
    <motion.path
      d="M0,25 Q50,5 100,25 T200,25 T300,25 T400,25 T500,25"
      fill="none"
      stroke="#38B88F"
      strokeWidth="2"
      strokeLinecap="round"
      animate={{
        d: [
          "M0,25 Q50,5 100,25 T200,25 T300,25 T400,25 T500,25",
          "M0,25 Q50,45 100,25 T200,25 T300,25 T400,25 T500,25",
          "M0,25 Q50,5 100,25 T200,25 T300,25 T400,25 T500,25",
        ],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);

const Hero = () => {
  const stats = [
    { icon: Shield, label: "Compliance Rate", value: "99%" },
    { icon: Headphones, label: "Support Available", value: "24/7" },
    { icon: Award, label: "Years Experience", value: "15+" },
  ];

  return (
    <section className="relative min-h-screen bg-[#F8FFF8] overflow-hidden pt-[72px]">
      <WaveBackground />

      {/* Soft floating blobs */}
      <Blob
        className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.08]"
        color="#38B88F"
      />
      <Blob
        className="absolute top-1/3 -left-32 w-[300px] h-[300px] opacity-[0.06]"
        color="#059669"
      />

      {/* Dotted grid decoration */}
      <div
        className="absolute top-32 right-[15%] w-24 h-24 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #38B88F 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div
        className="absolute bottom-40 left-[10%] w-20 h-20 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle, #059669 1.5px, transparent 1.5px)",
          backgroundSize: "10px 10px",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#38B88F]/20 rounded-full px-4 py-2 mb-8 shadow-sm"
            >
              <Award className="w-4 h-4 text-[#038C2A]" />
              <span className="text-sm text-[#038C2A] font-medium">
                Award-winning Tax Consultant in Nigeria
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[3rem] sm:text-[4rem] lg:text-[5rem] font-extrabold leading-[1.05] tracking-tight text-[#1a1a1a] mb-4"
            >
              SIMPLIFY
              <br />
              YOUR{" "}
              <span className="text-[#038C2A]">TAXES</span>
              <AnimatedWaveLine />
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-lg mb-10"
            >
              Get expert tax consultation, file with confidence, and maximize your
              savings. Simplify your taxes with our intelligent platform and
              experienced tax consultants.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-[#038C2A] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#026b21] transition-all shadow-lg shadow-[#038C2A]/20"
              >
                Get Started For Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 border-2 border-[#038C2A] text-[#038C2A] px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#038C2A] hover:text-white transition-all"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-8 lg:gap-12"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F8FFF8] border border-[#38B88F]/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-[#038C2A]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#1a1a1a]">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-full border-2 border-dashed border-[#38B88F]/20 animate-[spin_20s_linear_infinite]" />
              <img
                src={assets.hero_img}
                alt="Tax Professionals"
                className="relative z-10 w-full max-w-[500px] mx-auto rounded-3xl shadow-2xl"
              />

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 z-20 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#F8FFF8] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#038C2A]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1a1a1a]">Real-time</p>
                  <p className="text-[10px] text-gray-500">Tax Updates</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-8 -right-4 z-20 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#F8FFF8] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#038C2A]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1a1a1a]">FIRS</p>
                  <p className="text-[10px] text-gray-500">Compliant</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
