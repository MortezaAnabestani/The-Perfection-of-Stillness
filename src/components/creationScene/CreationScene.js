import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import styles from "./CreationScene.module.css";
import UnmovedMover from "../cosmosScene/UnmovedMover";
import DriftingParticle from "./DriftingParticle";

const GuideComet = ({ progress }) => (
  <motion.div
    className={styles.guideComet}
    style={{
      top: useTransform(progress, [0, 1], ["85%", "30%"]),
      opacity: useTransform(progress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]),
    }}
  >
    <div className={styles.cometHead} />
    <div className={styles.cometTail} />
  </motion.div>
);

const AnimatedWord = ({ children, progress, index }) => {
  const wordOpacity = useTransform(progress, [index * 0.05, index * 0.05 + 0.2], [0, 1]);
  const wordY = useTransform(progress, [index * 0.05, index * 0.05 + 0.2], [50, 0]);
  const wordBlur = useTransform(progress, [index * 0.05, index * 0.05 + 0.2], [10, 0]);
  return (
    <motion.span
      className={styles.word}
      style={{
        opacity: wordOpacity,
        y: wordY,
        filter: useTransform(wordBlur, (v) => `blur(${v}px)`),
      }}
    >
      {children}
    </motion.span>
  );
};

const CreationScene = ({ goToNextScene }) => {
  const [guideAnimationComplete, setGuideAnimationComplete] = useState(false);
  const [isBlackhole, setIsBlackhole] = useState(true);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const progress = useMotionValue(0);

  useEffect(() => {
    mouseY.set(window.innerHeight);
    mouseX.set(window.innerWidth / 2);

    const controls = animate(progress, 1, {
      duration: 7,
      ease: "easeInOut",
      onComplete: () => setGuideAnimationComplete(true),
    });
    return () => controls.stop();
  }, [progress, mouseX, mouseY]);

  const handleMouseMove = (e) => {
    if (guideAnimationComplete) {
      const currentMouseY = e.clientY;
      mouseX.set(e.clientX);
      mouseY.set(currentMouseY);

      const progressValue = 1 - (currentMouseY - window.innerHeight * 0.2) / (window.innerHeight * 0.6);
      progress.set(Math.max(0, Math.min(1, progressValue)));

      const threshold = window.innerHeight * 0.6;

      if (currentMouseY > threshold) {
        if (!isBlackhole) setIsBlackhole(true);
      } else {
        if (isBlackhole) setIsBlackhole(false);
      }
    }
  };

  const particles = Array.from({ length: 200 });
  const poemText = "که ذرات وجود را از عدم به ماورایِ کمال برانی";
  const words = poemText.split(" ");
  const finalLine = "و خود در صفتِ کمال تا ابَد فرولمیده باشی";

  const voidOpacity = useTransform(progress, [0, 0.8], [1, 0]);
  const firstLineOpacity = useTransform(progress, [0, 0.4], [1, 0]);
  const finalLineOpacity = useTransform(progress, [0.9, 1], [0, 1]);

  return (
    <motion.div
      className={styles.canvas}
      onMouseMove={handleMouseMove}
      onDoubleClick={goToNextScene}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <motion.div
        className={styles.mouseAura}
        style={{ x: mouseX, y: mouseY }}
        animate={{ opacity: guideAnimationComplete ? 1 : 0 }}
      />

      <UnmovedMover isBlackhole={isBlackhole} />

      {!guideAnimationComplete && <GuideComet progress={progress} />}

      <motion.div
        className={styles.voidZone}
        style={{ opacity: voidOpacity, "--mouse-x": `${mouseX.get()}px`, "--mouse-y": `${mouseY.get()}px` }}
      >
        {particles.map((_, i) => (
          <DriftingParticle key={i} mouseX={mouseX} mouseY={mouseY} />
        ))}
        <div className={styles.voidLabel}>عَدَم</div>
      </motion.div>

      <motion.div className={styles.poemTextContainer}>
        <motion.p className={styles.firstLine} style={{ opacity: firstLineOpacity }}>
          بگو نمی‌شود
        </motion.p>
        <div className={styles.wordContainer}>
          {words.map((word, index) => (
            <AnimatedWord key={index} progress={progress} index={index}>
              {word}
            </AnimatedWord>
          ))}
        </div>
        <motion.p className={styles.finalLine} style={{ opacity: finalLineOpacity }}>
          {finalLine}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default CreationScene;
