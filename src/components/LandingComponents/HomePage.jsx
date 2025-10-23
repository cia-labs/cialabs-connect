'use client';
import LogoAnimation from './LogoAnimation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ShortsHighlightsView from './Shorts_view';
import NavBar from './NavBar';
import Footer from '../footer';

const LoadingPage = () => {
  const [changingText, setChangingText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  
  const staticText = "Together, we are here to build...";
  const dynamicTexts = [
    "the next generation of technology.",
    "solutions that challenge the status quo.", 
    "a culture of fearless innovation.",
    "bridges between brilliant ideas and reality.",
    "the skills that will define tomorrow.",
    "a place driven by shared curiosity."
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 3500);
    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const text = dynamicTexts[textIndex];
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setChangingText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, [textIndex]);

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      
      {/* Enhanced Hero Section for Mobile */}
      <div className="pt-20 md:pt-24 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
        {/* Hero Image with Better Mobile Scaling */}
        <div className="w-full max-w-md mx-auto mb-6 md:mb-10 px-4">
          <img 
            className="w-full h-auto transform hover:scale-105 transition-transform duration-500" 
            src="/hero_img.jpg" 
            alt="CIA Labs"
          />
        </div>
        
        {/* Enhanced Text Content */}
        <div className="text-center max-w-4xl mx-auto w-full px-4">
          <div className="text-xl md:text-xl lg:text-2xl text-gray-300 leading-relaxed">
            <span className="text-white font-medium">{staticText}</span>
          </div>
          
          {/* Dynamic Text with Improved Mobile Styling */}
          <div className="text-lg md:text-xl lg:text-2xl text-[#77FAB9] font-semibold min-h-[3rem] md:min-h-[2rem] flex items-center justify-center">
            <span className="text-center leading-tight">
              {changingText}
              <span className="animate-pulse ml-1">|</span>
            </span>
          </div>
          
          {/* Enhanced CTA Button */}
          <button className="bg-black hover:bg-[#1cd178] text-white font-semibold rounded-full px-8 py-4 mt-8 md:mt-10 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/45">
            Explore our events
          </button>
        </div>
        
        {/* Shorts Section */}
        <div className="w-full mt-12 md:mt-16">
          <ShortsHighlightsView/>
        </div>
      </div>
      </div>
  );
};


// Variants for the main container to stagger animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5, // Time between the text and the lines animating in
    },
  },
};

// Variants for the "CIA LABS" text
const textVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Reduced loading time for better UX
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen flex flex-col justify-center items-center px-4">
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated "CIA LABS" Text */}
        <motion.h2
          className="text-5xl md:text-7xl font-bold tracking-wider mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500"
          variants={textVariants}
        >
          CIA LABS
        </motion.h2>

        {/* Animated Gradient Lines */}
        <div className="md:pl-30 pl-12 lg:pl-25">
        <LogoAnimation />
        </div>
      </motion.div>
    </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <LoadingPage />
      <Footer/>
    </div>
  );
};

export default HomePage;
