"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./NavBar";
import Link from "next/link";
import { motion } from "framer-motion";

const events = [
  {
    id: 1,
    tag: "READY.SET.BUILD",
    title: "Robo Soccer 2025",
    subtitle: "COMMUNITY DAY 2",
    desc: "Mark your Calendar's Nov 2nd week.",
    buttonText: "Registration Closed",
    buttonStyle: "bg-green-500 hover:bg-green-600 text-black",
    details: {
      about:
        "The Robo Soccer 2025 event challenges teams to design and program autonomous robots that can compete in a soccer match! Teams will showcase creativity, precision, and teamwork through high-energy matches.",
      highlights: [
        " Build and program your own soccer-playing bot",
        " Compete for the CIA LABS Champion title",
        " Team up with fellow innovators",
        " Showcase strategy, design, and control excellence",
      ],
      note: "Full event schedule and team requirements will be released soon.",
    },
  },
  {
    id: 2,
    tag: "READY.SET.FLY",
    title: "DRONE F-450",
    subtitle: "CIA LABS × TCD2",
    desc: "Mark your Calendar's Nov 2nd week.",
    buttonText: "Stay Tuned",
    buttonStyle: "bg-gray-700 hover:bg-gray-600 text-white",
  },
];

const teamMembers = [
  { name: "Valyrian", role: "Nothing cuts like Valryian's grace!", image: "/valerian.jpg" },
  { name: "BotBowlers", role: "Code, Kick, Conquer", image: "/BotBowlers.jpg" },
  { name: "404 Not Found", role: "When the code meets the goal", image: "/hero_img.jpg" },
  { name: "Robo United", role: "Glory Glory Robo Utd", image: "/robounited.jpg" },
  { name: "Mech-X4!", role: "If You Never Accept the Frustration of Losing, You'll Never Grow.", image: "/mechX4.jpg" },
  { name: "Robrawler", role: "तेज और उग्र", image: "/hero_img.jpg" },
  { name: "The Innovators ", role: "WE WILL BE BACK", image: "/hero_img.jpg" },
  { name: "Robo Rangers", role: "Tomorrow by Together ", image: "/hero_img.jpg" },
  { name: "Survivors", role: "will show whats winning feels like", image: "/hero_img.jpg" },
  { name: "Victory squad ", role: "Hello World", image: "/victorysquad.jpg" },
  { name: "RoboQuad", role: "You should  quit one day", image: "/RoboQuad.jpg" },
  { name: "Tech Titans", role: " Together  towards Tomorrow", image: "/techtitans.jpg" },
];

const UpcomingEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showTeam, setShowTeam] = useState(false);
  const [popupMember, setPopupMember] = useState(null);
  const [rotation, setRotation] = useState(0);

  // ⭐ Registration popup
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

  const goBack = () => {
    setSelectedEvent(null);
    setShowTeam(false);
    setPopupMember(null);
  };

  useEffect(() => {
    if (!showTeam) return;

    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.5);
    }, 50);

    return () => clearInterval(interval);
  }, [showTeam]);

  // 🔥 Event Details Page
  if (selectedEvent) {
    const event = events.find((e) => e.id === selectedEvent);

    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <div className="px-6 md:px-20 py-24">
          <button
            onClick={goBack}
            className="text-green-400 hover:text-white transition mb-6"
          >
            ← Back to Events
          </button>

          {/* Event Info */}
          <div className="bg-[#0a0a0a] border border-green-900/30 rounded-3xl p-8 shadow-[0_0_10px_rgba(0,255,150,0.08)] max-w-4xl mx-auto text-center">
            <p className="text-green-400 text-sm mb-1 font-semibold">
              {event.subtitle}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{event.tag}</h2>
            <h3 className="text-lg md:text-xl text-gray-300 mb-3">{event.title}</h3>
            <p className="text-gray-400 mb-6">{event.desc}</p>

            {event.details && (
              <>
                <h3 className="text-xl text-green-400 font-semibold mb-3">
                  About the Event
                </h3>
                <p className="text-gray-300 mb-4">{event.details.about}</p>

                <h4 className="text-green-400 font-semibold mb-2">Highlights</h4>
                <ul className="list-disc list-inside text-gray-400 mb-4 space-y-1 text-left">
                  {event.details.highlights.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <p className="text-gray-500 italic">{event.details.note}</p>

                <div className="flex justify-center gap-4 mt-8">

                  <Link href="/Robo-Leaderboard">
                    <button className="bg-[#00ff99] text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300">
                      View Leaderboard
                    </button>
                  </Link>

                  <button
                    onClick={() => setShowTeam((prev) => !prev)}
                    className="border border-green-400 text-green-400 px-6 py-3 rounded-xl font-semibold hover:bg-green-500 hover:text-black transition-transform hover:scale-105 duration-300"
                  >
                    {showTeam ? "Hide Team" : "Meet the Team"}
                  </button>

                  {/* ⭐ Register Button */}
                  <button
                    onClick={() => setShowRegisterPopup(true)}
                    className="bg-green-400 hover:bg-green-500 px-6 py-3 rounded-xl text-black font-semibold"
                  >
                    Register
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Team Carousel */}
          {showTeam && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-20 flex flex-col items-center justify-center relative"
            >
              <h2 className="text-4xl font-bold text-center text-green-400 mb-12 drop-shadow-[0_0_10px_rgba(0,255,150,0.2)]">
                Meet the Team
              </h2>

              <div className="relative flex justify-center items-center py-10 w-full select-none">
                <div
                  className="relative flex justify-center items-center"
                  style={{
                    perspective: "1200px",
                    transformStyle: "preserve-3d",
                    width: "600px",
                    height: "400px",
                    transform: "translateZ(-400px)",
                  }}
                >
                  {teamMembers.map((member, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-[150px] h-[200px] bg-[#0d0d0d] border border-green-800/40 rounded-xl p-4 shadow-[0_0_15px_rgba(0,255,150,0.1)] flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 transition-transform"
                      style={{
                        transform: `rotateY(${
                          rotation + i * (360 / teamMembers.length)
                        }deg) translateZ(400px)`,
                      }}
                      onClick={() => setPopupMember(member)}
                    >
                      <img
                        src={member.image}
                        className="w-28 h-28 rounded-md object-cover border-2 border-green-500 mb-3"
                      />
                      <h3 className="text-lg font-semibold text-gray-100">{member.name}</h3>
                      <p className="text-xs text-green-400">{member.role}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Member Popup */}
              {popupMember && (
                <div
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                  onClick={() => setPopupMember(null)}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#0a0a0a] border border-green-800/40 rounded-2xl p-6 max-w-sm text-center shadow-[0_0_20px_rgba(0,255,150,0.2)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={popupMember.image}
                      className="w-40 h-40 rounded-md border-2 border-green-400 mx-auto mb-3"
                    />
                    <h3 className="text-xl text-white font-semibold mb-1">
                      {popupMember.name}
                    </h3>
                    <p className="text-green-400 mb-2 text-sm">{popupMember.role}</p>
                    <button
                      onClick={() => setPopupMember(null)}
                      className="mt-5 bg-green-500 text-black px-6 py-2 rounded-xl hover:bg-green-600"
                    >
                      Close
                    </button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* ⭐ Registration Popup */}
        {showRegisterPopup && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#0a0a0a] border border-green-700 rounded-2xl p-8 shadow-lg max-w-sm w-full text-center">

              <h2 className="text-2xl font-bold mb-4 text-green-400">
                Register For
              </h2>

              <div className="flex flex-col gap-4">

                <Link href="/Performance">
                  <button className="bg-green-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-green-600 w-full transition">
                    Performance
                  </button>
                </Link>

                <Link href="/Stalls">
                  <button className="bg-green-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-green-600 w-full transition">
                    Stalls
                  </button>
                </Link>

              </div>

              <button
                onClick={() => setShowRegisterPopup(false)}
                className="mt-6 text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 🔥 Events List Page
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="pt-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-wide">
          <span className="text-gray-400">UPCOMING</span>{" "}
          <span className="text-white">EVENTS</span>
        </h1>
      </div>

      <div className="flex flex-col items-center gap-10 mt-14 px-6 md:px-20 pb-20">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="w-full max-w-3xl cursor-pointer"
            onClick={() => setSelectedEvent(event.id)}
          >
            <div className="bg-[#0a0a0a] border border-green-900/30 rounded-3xl shadow-[0_0_15px_rgba(0,255,150,0.08)] p-8 hover:shadow-[0_0_25px_rgba(0,255,150,0.15)] transition-all duration-500">
              <p className="text-green-400 text-sm mb-1 font-semibold">
                {event.subtitle}
              </p>

              <h2 className="text-2xl md:text-3xl font-bold mb-3">{event.tag}</h2>
              <h3 className="text-lg md:text-xl text-gray-300 mb-3">{event.title}</h3>
              <p className="text-sm text-gray-400 mb-6">{event.desc}</p>

              <button
                className={`${event.buttonStyle} px-6 py-3 rounded-xl font-semibold transition-transform hover:scale-105 duration-300`}
              >
                {event.buttonText}
              </button>

              <p className="text-gray-500 italic mt-3 text-sm">
                Click to view details →
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
