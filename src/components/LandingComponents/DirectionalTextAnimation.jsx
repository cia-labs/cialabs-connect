"use client"
import React, { useState, useEffect } from 'react';

const DirectionalTextAnimation = ({ texts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const animationDelay = 800; // Time each text stays visible
  const fadeTransition = 300; // Fade transition duration

  useEffect(() => {
    if (texts && texts.length > 0) {
      const showFirstText = setTimeout(() => {
        setIsVisible(true);
      }, 400);

      const startLoop = () => {
        const fadeOutTimeout = setTimeout(() => {
          setIsVisible(false);
        }, animationDelay - fadeTransition);

        const nextTextTimeout = setTimeout(() => {
          setCurrentIndex(prevIndex => {
            const nextIndex = (prevIndex + 1) % texts.length;
            return nextIndex;
          });
          setIsVisible(true);
        }, animationDelay);

        return [fadeOutTimeout, nextTextTimeout];
      };

      // Start the loop after initial text appears
      const initialLoop = setTimeout(() => {
        const loop = () => {
          const timeouts = startLoop();
          setTimeout(loop, animationDelay);
          return timeouts;
        };
        loop();
      }, animationDelay);

      return () => {
        clearTimeout(showFirstText);
        clearTimeout(initialLoop);
      };
    }
  }, [texts]);

  if (!texts || texts.length === 0) return null;

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all transform duration-700 ease-out absolute inset-0 flex items-center justify-center';
    
    if (isVisible) {
      return `${baseClasses} opacity-100 translate-y-0 translate-x-0`;
    } else {
      // Alternating direction based on current index
      const direction = currentIndex % 2 === 0
        ? 'translate-x-10 translate-y-5'   // From RIGHT-bottom for odd indices
        : '-translate-x-10 translate-y-5'  // From LEFT-bottom for even indices
        
      
      return `${baseClasses} opacity-0 ${direction}`;
    }
  };

  return (
    <div className="flex items-center justify-center font-sans p-4 relative h-32 md:h-40">
      <div className="relative w-full max-w-4xl">
        <div className={getAnimationClasses()}>
          <h2 className="text-xl md:text-5xl font-bold text-[#77FAB9] text-center">
            {texts[currentIndex]}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DirectionalTextAnimation;
