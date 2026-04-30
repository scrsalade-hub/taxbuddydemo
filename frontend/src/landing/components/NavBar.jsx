import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { assets } from '../../assets/assets';

const NavBar = ({ open, setOpen, user }) => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/resources", label: "Resources" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ];

  const serviceItems = [
    "Tax Planning",
    "Tax Filing & Compliance",
    "Tax Audit Support",
    "Personal Tax Consulting",
    "Business Tax Strategy",
    "VAT & PAYE Management",
  ];

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src={assets.logo}
                alt="TaxBuddy"
                className="h-[40px] w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 text-[15px] font-medium rounded-lg transition-colors ${
                    isActive(link.to)
                      ? "text-[#038C2A]"
                      : "text-gray-700 hover:text-[#038C2A]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 px-4 py-2 text-[15px] font-medium rounded-lg transition-colors ${
                    isActive("/services")
                      ? "text-[#038C2A]"
                      : "text-gray-700 hover:text-[#038C2A]"
                  }`}
                >
                  Services
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      servicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full mt-1 bg-white shadow-xl rounded-xl border border-gray-100 py-2 w-60 z-50"
                    >
                      {serviceItems.map((item, idx) => (
                        <Link
                          key={idx}
                          to="/services"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F8FFF8] hover:text-[#038C2A] transition-colors"
                        >
                          {item}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-[#038C2A] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#026b21] transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 text-[15px] font-medium hover:text-[#038C2A] transition-colors px-4 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#038C2A] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#026b21] transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-[#038C2A] transition-colors"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white lg:hidden pt-[72px]"
          >
            <div className="px-6 py-8 space-y-2 overflow-y-auto h-full pb-24">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 text-lg font-medium rounded-lg ${
                    isActive(link.to)
                      ? "text-[#038C2A] bg-[#F8FFF8]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <details className="group">
                <summary className="flex items-center justify-between px-4 py-3 text-lg font-medium text-gray-700 cursor-pointer list-none rounded-lg hover:bg-gray-50">
                  Services
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="pl-6 space-y-1 mt-1">
                  {serviceItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to="/services"
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:text-[#038C2A]"
                      onClick={() => setOpen(false)}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </details>

              <div className="pt-6 space-y-3 border-t border-gray-100 mt-6">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="block w-full text-center bg-[#038C2A] text-white py-3 rounded-lg font-medium"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg font-medium"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center bg-[#038C2A] text-white py-3 rounded-lg font-medium"
                      onClick={() => setOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
