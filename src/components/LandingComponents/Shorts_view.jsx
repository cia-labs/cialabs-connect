import React, { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import YouTube from 'react-youtube';

const VideoCard = ({ video, index }) => {
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const playerRef = useRef(null);

    const onPlayerReady = (event) => {
        playerRef.current = event.target;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                const currentTime = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();
                if (duration > 0) {
                    setProgress((currentTime / duration) * 100);
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const toggleMute = (e) => {
        e.stopPropagation();
        if (playerRef.current) {
            if (playerRef.current.isMuted()) {
                playerRef.current.unMute();
                setIsMuted(false);
            } else {
                playerRef.current.mute();
                setIsMuted(true);
            }
        }
    };

    const handleMouseEnter = () => {
        if (playerRef.current) {
            playerRef.current.playVideo();
        }
    };

    const handleMouseLeave = () => {
        if (playerRef.current) {
            playerRef.current.pauseVideo();
        }
    };

    const opts = {
        height: '288',
        width: '224',
        playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            loop: 1,
            playlist: video.id, // Important for looping
        },
    };

    return (
        <div 
            className="flex-shrink-0 w-48 sm:w-56 snap-start group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-2xl">
                <YouTube 
                    videoId={video.id} 
                    opts={opts} 
                    onReady={onPlayerReady}
                    className="w-full h-64 sm:h-72 object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute top-2 right-2">
                        <button
                            onClick={toggleMute}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                        >
                            {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/50">
                    <div
                        className="h-full bg-green-400"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-white mt-3 px-2 leading-tight">
                {video.title}
            </h3>
        </div>
    );
};

export default function ShortsHighlightsView() {
    const scrollContainerRef = useRef(null);

    const getYouTubeId = (url) => {
        let id = '';
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                id = urlObj.pathname.slice(1);
            } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
                if (urlObj.pathname.startsWith('/shorts/')) {
                    id = urlObj.pathname.split('/shorts/')[1];
                } else { // Handles standard /watch?v= links
                    id = urlObj.searchParams.get('v');
                }
            }
            return id.split('?')[0]; // Clean up any remaining query params
        } catch (error) {
            console.error("Invalid URL:", url);
            return null; // Return null for invalid URLs
        }
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    
    // Store full URLs in the data array
    const videoUrls = [
        { url: "https://youtube.com/shorts/rwfQ81mhkuQ?si=I4fZK6JOMneoqlWn", title: "Project Robo" },
        { url: "https://youtube.com/shorts/y-zx4ZI-qz4?si=QOiv6rrmu1rhlFzD", title: "Unstoppable" },
    ];

    // Process the URLs to extract IDs before rendering
    const videos = videoUrls.map(video => ({
        id: getYouTubeId(video.url),
        title: video.title
    })).filter(video => video.id); // Filter out any that failed to parse

    return (
        <div className="w-full bg-black py-8 sm:py-12">
            <section className="text-center text-white mb-8 sm:mb-12 px-4">
                <motion.h1
                    initial={{ filter: "blur(12px)", opacity: 0.3, y: 20 }}
                    whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.6 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent mb-4"
                >
                    HIGHLIGHTS
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-gray-400 text-sm sm:text-base max-w-md mx-auto"
                >
                    Watch our latest projects and events in action
                </motion.p>
            </section>

            <div className="relative px-4">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 hidden sm:block"
                >
                    ←
                </button>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 hidden sm:block"
                >
                    →
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4 sm:space-x-6 pb-6 sm:pb-8 px-2"
                >
                    {videos.map((video, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, amount: 0.8 }}
                            className="transform hover:-translate-y-3 transition-all duration-500 ease-out"
                        >
                            <VideoCard video={video} index={index} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
