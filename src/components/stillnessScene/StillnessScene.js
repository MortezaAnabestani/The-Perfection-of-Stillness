import React, { useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./StillnessScene.module.css";

const StillnessScene = ({ goToNextScene }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      goToNextScene();
    }, 11000);

    return () => clearTimeout(timer);
  }, [goToNextScene]);

  const poemLines = [
    { text: "ایستَنده‌", indent: false },
    { text: "ـ بر این صفت که تویی ـ", indent: true },
    { text: "کمالِ سکون است.", indent: false },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 2, delayChildren: 1 },
    },
  };
  const lineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.5 } },
  };

  return (
    <motion.div className={styles.poemText} variants={containerVariants} initial="hidden" animate="visible">
      {poemLines.map((line, index) => (
        <motion.p
          key={index}
          variants={lineVariants}
          className={line.indent ? styles.indentedLine : ""}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: index * 2.5 + 1 }}
        >
          {line.text}
        </motion.p>
      ))}
    </motion.div>
  );
};

export default StillnessScene;
