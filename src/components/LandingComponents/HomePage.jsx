'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoadingPage from './LoadingPage';
import ShortsHighlightsView from './Shorts_view';
import {NavBar} from './NavBar';

const staticText = "Together, we are here to build...";
const dynamicTexts = [
  "the next generation of technology.",
  "solutions that challenge the status quo.", 
  "a culture of fearless innovation.",
  "bridges between brilliant ideas and reality.",
  "the skills that will define tomorrow.",
  "a place driven by shared curiosity."
];

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [changingText, setChangingText] = useState('');
  const [textIndex, setTextIndex] = useState(0);

  // Loader timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic text loop
  useEffect(() => {
    if (isLoading) return;
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 3500);
    return () => clearInterval(textInterval);
  }, [isLoading]);

  // Typing effect for dynamic text
  useEffect(() => {
    if (isLoading) return;
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
  }, [textIndex, isLoading]);

  // Show loader until finished
  if (isLoading) {
    return <LoadingPage />;
  }

  // Main homepage content
  return (
    <div className="bg-black min-h-screen">
      <NavBar/>
      <div className="pt-20 md:pt-24 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md mx-auto mb-6 md:mb-10 px-4">
          <img 
            className="w-full h-auto transform hover:scale-105 transition-transform duration-500" 
            src="/hero_img.jpg" 
            alt="CIA Labs"
          />
        </div>
        <div className="text-center max-w-4xl mx-auto w-full px-4">
          <div className="text-2xl md:text-xl lg:text-2xl text-gray-300 leading-relaxed">
            <span className="text-white font-medium">{staticText}</span>
          </div>
          <div className="text-md md:text-xl lg:text-2xl text-[#77FAB9]/80 font-semibold min-h-[3rem] md:min-h-[2rem] flex items-center justify-center">
            <span className="text-center leading-tight">
              {changingText}
              <span className="animate-pulse ml-1">|</span>
            </span>
          </div>
          <Link href="/upcoming-events"><button className="bg-black border-2 hover:border-[#73daa6] text-white font-semibold rounded-3xl px-8 py-4 mt-8 md:mt-10 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/45">
            Explore our events
          </button></Link>
        </div>
        <div className="w-full mt-12 md:mt-16">
          <ShortsHighlightsView />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
