'use client';
import React, { useState } from 'react';
import { NavBar } from './NavBar';
import { motion } from 'framer-motion';

const projects = [
  {
    id: 1,
    subtitle: "ENGINEER. INNOVATE. EXCEL.",
    title: "Skills and thrills",
    tag: "50 Days  50 Sessions ",
    desc: "Embark on an intense 50-day journey of learning, building, and innovating. Each session brings a new challenge and a new skill.",
    buttonText: "View Progress",
    buttonStyle: "bg-green-500 hover:bg-green-600 text-black",
    details: {
      about:
        "The '50 Days 50 Sessions' program is designed to push limits, boost creativity, and build consistency. Participants engage daily in coding, robotics, and problem-solving activities leading up to the grand Mangalore competition.",
      highlights: [
        "Daily themed coding and robotics sessions",
        "Hands-on mentorship from CIA LABS experts",
        "Leaderboard tracking every week",
        "Showcase final prototypes in Mangalore",
      ],
      note: "This challenge rewards consistency — show up every day, build something new, and evolve as an innovator.",
    },
  },
  {
    id: 2,
    subtitle: "READY. SET. BUILD.",
    title: "Robotics Competition",
    tag: "21st Karnataka State Level ISTE Student Convention,2025",
    desc: "Battle it out in the ultimate test of robotics and strategy — where machines play, and innovation scores the goals.",
    buttonText: "View Details",
    buttonStyle: "bg-green-500 hover:bg-green-600 text-black",
    details: {
      about:
        "The Robo Soccer Championship is CIA Labs’ flagship robotics competition, held in  YIT Mangalore. Teams design, build, and program autonomous or manually controlled bots to compete in high-speed soccer matches. It’s where engineering meets adrenaline!",
      highlights: [
        "Design and build soccer-playing robots",
        "Dynamic real-time matches with scoring system",
        "Judging based on design, control, and teamwork",
        "Exciting prizes and recognition for top teams",
      ],
      note: "The competition is not just about winning — it’s about building, collaborating, and celebrating innovation in robotics.",
    },
  },
];

const OngoingProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const goBack = () => {
    setSelectedProject(null);
  };

  if (selectedProject) {
    const project = projects.find((p) => p.id === selectedProject);

    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <div className="px-6 md:px-20 py-24">
          <button
            onClick={goBack}
            className="text-green-400 hover:text-white transition mb-6"
          >
            ← Back to Projects
          </button>

          {/* Project Details */}
          <div className="bg-[#0a0a0a] border border-green-900/30 rounded-3xl p-8 shadow-[0_0_10px_rgba(0,255,150,0.08)] max-w-4xl mx-auto text-center">
            <p className="text-green-400 text-sm mb-1 font-semibold">
              {project.subtitle}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{project.tag}</h2>
            <h3 className="text-lg md:text-xl text-gray-300 mb-3">
              {project.title}
            </h3>
            <p className="text-gray-400 mb-6">{project.desc}</p>

            <h3 className="text-xl text-green-400 font-semibold mb-3">
              About the Project
            </h3>
            <p className="text-gray-300 mb-4">{project.details.about}</p>

            <h4 className="text-green-400 font-semibold mb-2">Highlights</h4>
            <ul className="list-disc list-inside text-gray-400 mb-4 space-y-1 text-left">
              {project.details.highlights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="text-gray-500 italic">{project.details.note}</p>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 Project List View
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="pt-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-wide">
          <span className="text-gray-400">ONGOING</span>{' '}
          <span className="text-white">PROJECTS</span>
        </h1>
      </div>

      <div className="flex flex-col items-center gap-10 mt-14 px-6 md:px-20 pb-20">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="w-full max-w-3xl cursor-pointer"
            onClick={() => setSelectedProject(project.id)}
          >
            <div className="bg-[#0a0a0a] border border-green-900/30 rounded-3xl shadow-[0_0_15px_rgba(0,255,150,0.08)] p-8 hover:shadow-[0_0_25px_rgba(0,255,150,0.15)] transition-all duration-500">
              <p className="text-green-400 text-sm mb-1 font-semibold">
                {project.subtitle}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {project.tag}
              </h2>
              <h3 className="text-lg md:text-xl text-gray-300 mb-3">
                {project.title}
              </h3>
              <p className="text-sm text-gray-400 mb-6">{project.desc}</p>
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

export default OngoingProjects;
