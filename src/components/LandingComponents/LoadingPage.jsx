'use client';
import { LogoAnimation } from './LogoAnimation';
import { motion } from 'framer-motion';

const LoadingPage = () => {
  
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen flex flex-col justify-center items-center px-4">
      <motion.div
        className="text-center"
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-5xl md:text-7xl font-bold tracking-wider mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500"
        >
          CIA LABS
        </motion.h2>
        <div className="md:pl-30 pl-12 lg:pl-25">
          <LogoAnimation />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingPage;
