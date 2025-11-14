'use client';
import React, { useState } from 'react';
import { NavBar } from './NavBar';
import { motion } from 'framer-motion';

const projects = [
  {
    id: 1,
    subtitle: "CREATE. INNOVATE. TRANSFORM.",
    title: "CIT 2025",
    tag: "Campus Innovation Tournament",
    desc: "A showcase of brilliant ideas, prototypes, and innovations by student teams from across Karnataka.",
    buttonText: "View Progress",
    buttonStyle: "bg-green-500 hover:bg-green-600 text-black",
    details: {
      about:
        "CIT  2025 brought together young innovators to present cutting-edge projects that solve real-world challenges through technology. The event highlighted creativity, design thinking, and teamwork.",
      highlights: [
        "Our Team reached Semi-Finals!",
        "Judging was based on innovation, impact, and feasibility",
    
      ],
      note: "CIT was not just a competition — it was a platform to turn ideas into impact.",
    },
  },
  {
    id: 2,
    subtitle: "CONNECT. COLLABORATE. CELEBRATE.",
    title: "Community Day 1",
    tag: "CIA LABS Inaugural Community Event",
    desc: "An inspiring day of connection, collaboration, and creativity where innovators came together under one roof.",
    buttonText: "View Details",
    buttonStyle: "bg-green-500 hover:bg-green-600 text-black",
    details: {
      about:
        "Community Day 1 marked the beginning of the CIA LABS community events — bringing students, mentors, and creators together to celebrate innovation and learning. From workshops to fun challenges, it was an unforgettable start to a new tradition.",
      highlights: [
        "Interactive Clubs Activities and Cultural Performances",
        "Team showcase of ongoing projects",
        "We've Build Trebuchet Catapult ,6 total teams played mactches with each other",
        "Fun activities and live Connection building App ,Student got to know each other better",
      ],
      note: "Community Day 1 reminded everyone that innovation thrives in collaboration.",
    },
  },
  {
    id: 3,
    subtitle: "ENGINEER. DEVELOP. INNOVATE.",
    title: "EDITH 1",
    tag: "Explore . Design . Innovate . Tinker . Hack",
    desc: "",
    buttonText: "View Details",
    buttonStyle: "bg-green-500 hover:bg-green-600 text-black",
    details: {
      about:
        "E.D.I.T.H. 1 was in collaboration with CIA LABS’ ",
      highlights: [
        "E.D.I.T.H 1.0 is a one-day tech fest designed to spark creativity and innovation in the fields of Robotics, IoT, and Embedded Systems. The event unites students, enthusiasts, and experts through a blend of learning sessions, hands-on challenges, and competitive activities. ",
        ],
      note: "From learning to building to competing, E.D.I.T.H 1.0 celebrates innovation, teamwork, and the future of intelligent systems. ",
    },
  },
];

const Recap = () => {
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
              About the Event
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
          <span className="text-gray-400">RECAP</span>{' '}
          <span className="text-white">EVENTS</span>
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

export default Recap;
