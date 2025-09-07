import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import styles from "./CosmosScene.module.css";
import UnmovedMover from "./UnmovedMover";
import Particle from "./Particle";

const AnimatedText = ({ text, lineIndex }) => {
  const [isHovered, setIsHovered] = useState(false);
  const words = text.split(" ");
  const radius = 80 + lineIndex * 50;

  return (
    <motion.div
      className={styles.lineContainer}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: lineIndex * 2 }}
    >
      {words.map((word, index) => {
        const angle = (index / words.length) * 2 * Math.PI;

        return (
          <motion.span
            key={index}
            className={styles.word}
            animate={{
              x: isHovered ? radius * Math.cos(angle) : 0,
              y: isHovered ? radius * Math.sin(angle) : 0,
              rotate: isHovered ? (angle * 180) / Math.PI + 90 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.div>
  );
};

const CosmosScene = ({ goToNextScene }) => {
  const [particles, setParticles] = useState([]);

  const handleCanvasClick = (e) => {
    const newParticle = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setParticles((prev) => [...prev, newParticle]);
  };

  const x = useMotionValue(window.innerWidth / 2);
  const y = useMotionValue(window.innerHeight / 2);

  const rotateX = useTransform(y, [0, window.innerHeight], [15, -15]);
  const rotateY = useTransform(x, [0, window.innerWidth], [-15, 15]);

  const handleMouseMove = (e) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  const poemLines = [
    "مگر که می‌شود از ازل",
    "ذرّه تا زُحَل از تو بجُنبد",
    "و تو خود هیچ نجنبیده باشی؟",
    "چگونه می‌شود!",
  ];

  return (
    <motion.div
      className={styles.canvas}
      onClick={handleCanvasClick}
      onDoubleClick={goToNextScene}
      onMouseMove={handleMouseMove}
      style={{ perspective: 400, rotateX, rotateY }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <div className={styles.sceneCenter}>
        <UnmovedMover />

        {particles.map((p) => (
          <Particle key={p.id} startX={p.x} startY={p.y} />
        ))}

        <div className={styles.poemText}>
          {poemLines.map((line, index) => (
            <AnimatedText key={index} text={line} lineIndex={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CosmosScene;
