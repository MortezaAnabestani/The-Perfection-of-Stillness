import React from "react";
import { motion } from "framer-motion";
import styles from "./PerfectedParticle.module.css";

const colors = ["#FF00FF", "#00FFFF", "#FFFF00", "#FF5733", "#33FF57"];

const PerfectedParticle = ({ x, y }) => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomSize = 5 + Math.random() * 10;

  return (
    <motion.div
      className={styles.particle}
      style={{
        top: y,
        left: x,
        width: randomSize,
        height: randomSize,
        backgroundColor: randomColor,
        boxShadow: `0 0 15px 5px ${randomColor}`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: [0.5, 1, 0.8, 0], rotate: 0 }}
      transition={{
        duration: 4,
        ease: "easeOut",
        opacity: { times: [0, 0.2, 0.8, 1], duration: 4 },
      }}
    />
  );
};

export default PerfectedParticle;
