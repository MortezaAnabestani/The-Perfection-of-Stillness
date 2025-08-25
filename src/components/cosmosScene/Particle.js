import React from "react";
import { motion } from "framer-motion";
import styles from "./Particle.module.css";

const Particle = ({ startX, startY }) => {
  const endX = Math.random() < 0.5 ? -100 : window.innerWidth + 100;
  const endY = Math.random() * window.innerHeight;

  return (
    <motion.div
      className={styles.particle}
      style={{
        top: startY,
        left: startX,
        backgroundColor: `#ffffff`,
      }}
      initial={{ opacity: 1, scale: 3 }}
      animate={{
        x: endX - startX,
        y: endY - startY,
        opacity: 0,
        scale: 1,
      }}
      transition={{
        duration: 3 + Math.random() * 4,
        ease: "circOut",
      }}
    />
  );
};

export default Particle;
