"use client";

import { useState } from "react";
import Link from "next/link";
import { FaSearch, FaTimes, FaUser, FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Animation variants for the mobile menu container
    const menuVariants = {
        hidden: {
            // CHANGED: From "-100%" to "100%" to slide from the right
            x: "100%",
            transition: {
                type: "tween",
                duration: 0.3,
            },
        },
        visible: {
            x: 0,
            transition: {
                type: "tween",
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    // Animation variants for individual menu items
    const menuItemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 px-6 py-2">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Left section - Logo */}
                    <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                            <Link href="#"><img className='w-[50px] h-[50px]' src="/LOGO.png" alt="cia"/></Link>
                        </div>
                    </div>

                    {/* Center section - Navigation Links for Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/" className="text-white hover:text-green-400 transition-colors">Home</a>
                        <a href="/about" className="text-white hover:text-green-400 transition-colors">About</a>
                        <a href="/upcoming-events" className="text-white hover:text-green-400 transition-colors">Upcoming Events</a>
                        <a href="/contactus" className="text-white hover:text-green-400 transition-colors">Contact Us</a>
                    </div>

                    {/* Right section - Actions and Mobile Menu Toggle */}
                    <div className="flex items-center space-x-4">
                        <button className="hidden sm:block bg-[#23e986] hover:bg-green-600 text-black px-4 py-2 rounded-lg font-medium transition-colors">
                            <Link href="/auth/callback">Connect App</Link>
                        </button>
                        
                        {/* Hamburger Menu Icon for mobile */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-green-400">
                                {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu - Slides in from the right */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={menuVariants}
                        // CHANGED: "left-0" to "right-0" and "border-r" to "border-l"
                        className="fixed top-0 right-0 h-full w-64 bg-black border-l border-gray-800 z-40 pt-20 px-6 md:hidden"
                    >
                        <div className="flex flex-col space-y-6">
                            <motion.a variants={menuItemVariants} href="#" className="text-white hover:text-green-400 transition-colors">Home</motion.a>
                            <motion.a variants={menuItemVariants} href="#" className="text-white hover:text-green-400 transition-colors">About</motion.a>
                            <motion.a variants={menuItemVariants} href="#" className="text-white hover:text-green-400 transition-colors">Upcoming Events</motion.a>
                            <motion.a variants={menuItemVariants} href="#" className="text-white hover:text-green-400 transition-colors">Contact Us</motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default NavBar;
