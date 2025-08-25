import React from "react";
import { motion } from "framer-motion";

const FlowingParticle = () => {
  const xStart = window.innerWidth / 2 + (Math.random() - 0.5) * 20;
  const yStart = window.innerHeight / 2 + (Math.random() - 0.5) * 20;
  const size = 3 + Math.random() * 4;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: xStart,
        top: yStart,
        width: size,
        height: size,
        backgroundColor: "#E04D5A",
        borderRadius: "50%",
        boxShadow: "0 0 8px #FF6B6B",
      }}
      animate={{
        y: window.innerHeight + 50,
        opacity: 0,
      }}
      transition={{
        duration: 5 + Math.random() * 5,
        ease: "linear",
      }}
    />
  );
};

export default FlowingParticle;
