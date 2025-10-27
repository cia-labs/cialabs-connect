"use client";
import NavBar from "@/components/LandingComponents/NavBar";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function CardsParallax() {
  const containerRef = useRef(null); // Removed TypeScript types
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const cards = [
    {
      title: "The Innovators",
      text: "At CIA Labs, we spark engineering creativity.",
      img: "/innovators.jpg",
      color: "#21392c",
    },
    {
      title: "Community in Action",
      text: "Building connections that matter.",
      img: "/community.jpg",
      color: "black",
    },
    {
      title: "Skills & Growth",
      text: "Inspiring the next generation.",
      img: "/future.jpg",
      color: "#484a25",
    },
    {
      title: "Shaping the Future",
      text: "In three words: Innovative, Welcoming, Dynamic. Our motive is to create an atmosphere where students thrive through collaboration.The impact? It builds belonging, sharpens skills, and prepares you for future challengesin engineering and beyond.",
      img: "/images/innovation.jpg",
      color: "black",
    },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        height: `${cards.length * 100}vh`,
        background: "#000",
        position: "relative",
      }}
    >
      <NavBar />
      {cards.map((card, i) => (
        <motion.div
          key={i}
          style={{
            position: "sticky",
            top: `${i * 5}vh`,
            height: "95vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            y: 0,
            zIndex: i + 1,
          }}
        >
          <div
            style={{
              width: "70%",
              maxWidth: "700px",
              height: "400px",
              padding: "40px",
              border: "1px solid green",
              borderRadius: "20px",
              background: card.color,
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  color: "#fff",
                  fontSize: "32px",
                  marginBottom: "10px",
                  fontWeight: "bold",
                }}
              >
                {card.title}
              </h2>
              <p style={{ color: "grey", fontSize: "16px", lineHeight: "1.5" }}>
                {card.text}
              </p>
            </div>
            <Image
              src={card.img}
              alt={card.title}
              width={250}
              height={200}
              style={{
                flex: 1,
                maxWidth: "350px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
