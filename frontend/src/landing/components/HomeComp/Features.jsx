import React from "react";
import { motion } from "framer-motion";
import { Calculator, FileText, Headphones, TrendingUp, Landmark, BookOpen, ClipboardCheck, Users } from "lucide-react";

const features = [
  { icon: Calculator, title: "Automated Tax Calculator", description: "Our intelligent tax calculator simplifies complex tax computations for individuals, SMEs, and corporations. Get accurate results in seconds." },
  { icon: FileText, title: "Tax Filing Assistance", description: "Navigate Nigeria's tax filing requirements with expert guidance and support for VAT, PAYE, WHT, and corporate tax returns." },
  { icon: Headphones, title: "Expert Consultation", description: "Connect with certified tax professionals for personalized advice tailored to your business structure and financial goals." },
  { icon: TrendingUp, title: "Tax Optimization", description: "Discover legitimate strategies to minimize your tax liability while staying fully compliant with Nigerian tax laws." },
  { icon: Landmark, title: "Compliance Monitoring", description: "Stay ahead of deadlines with automated reminders, compliance tracking, and real-time updates on regulatory changes." },
  { icon: BookOpen, title: "Educational Resources", description: "Access comprehensive guides, articles, and downloadable resources to deepen your understanding of Nigerian taxation." },
  { icon: ClipboardCheck, title: "Audit Support", description: "Get professional representation and documentation support during tax audits from government agencies." },
  { icon: Users, title: "Multi-User Collaboration", description: "Enable your finance team to collaborate seamlessly with role-based access and shared tax workspaces." },
];

const Features = () => {
  return (
    <section className="bg-[#0a2e1d] py-20 lg:py-28 relative overflow-hidden">
      {/* Soft SVG decoration */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.04]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90,-17.9,88.5,-2.9C87,12.1,81.4,26.5,72.6,38.7C63.8,50.9,51.8,60.9,38.5,68.2C25.2,75.5,10.6,80.1,-3.4,86.2C-17.4,92.3,-30.9,99.9,-43.3,93.8C-55.7,87.7,-67,68,-74.6,50.1C-82.2,32.2,-86.1,16.1,-84.8,1.1C-83.5,-13.9,-77,-27.8,-67.8,-39.4C-58.6,-51,-46.7,-60.3,-34.2,-68.2C-21.7,-76.1,-8.6,-82.6,4.7,-91.3C18,-100,36,-111,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold text-white leading-tight mb-4">
            Everything You Need to
            <br />
            <span className="text-[#38B88F]">Manage your Taxes</span>
          </h2>
          <p className="text-gray-400 text-base lg:text-lg max-w-2xl mx-auto">
            Comprehensive tools and services designed to simplify tax management for Nigerian businesses
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#38B88F]/20 flex items-center justify-center mb-5 group-hover:bg-[#38B88F]/30 transition-colors">
                <feature.icon className="w-6 h-6 text-[#38B88F]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
