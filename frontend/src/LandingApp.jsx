import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import Home from './landing/pages/Home';
import About from './landing/pages/About';
import Services from './landing/pages/Services';
import Resources from './landing/pages/Resources';
import Contact from './landing/pages/Contact';
import NavBar from './landing/components/NavBar';
import Footer from './landing/components/Footer';

export default function LandingApp() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <NavBar open={open} setOpen={setOpen} user={user} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
