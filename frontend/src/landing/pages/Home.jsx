import React from 'react';
import Hero from '../components/HomeComp/Hero';
import Features from '../components/HomeComp/Features';
import HowItWorks from '../components/HomeComp/HowItWorks';
import Consult from '../components/HomeComp/Consult';
import Faq from '../components/HomeComp/Faq';

const Home = () => {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <Consult />
      <Faq />
    </div>
  );
};

export default Home;
