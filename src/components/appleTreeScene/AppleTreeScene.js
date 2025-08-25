import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Matter from "matter-js";
import styled from "styled-components";
import styles from "./AppleTreeScene.module.css";

const WordComponent = React.forwardRef(({ children, isPoemWord }, ref) => (
  <WordStyle ref={ref} $isPoemWord={isPoemWord}>
    {children}
  </WordStyle>
));
const WordStyle = styled.div`
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;

  ${(props) =>
    props.$isPoemWord
      ? `
        font-size: 1.8rem;
        font-weight: 300;
        color: rgba(51, 51, 51, 0.9); /* رنگ سیاه */
        text-shadow: none;
      `
      : `
        font-size: 2.2rem;
        font-weight: bold;
        color: #c94040; /* رنگ قرمز */
        text-shadow: 0 0 10px #ff6b6b;
      `}
`;
const PoeticParticle = ({ x, y }) => (
  <motion.div
    className={styles.poeticParticle}
    style={{ left: x, top: y }}
    initial={{ scale: 1, opacity: 1 }}
    animate={{ y: y + 200 + Math.random() * 100, opacity: 0, scale: 0 }}
    transition={{ duration: 2 + Math.random() * 2, ease: "easeOut" }}
  />
);

const Blackhole = ({ onClick }) => (
  <motion.div
    className={styles.blackhole}
    onClick={onClick}
    initial={{ scale: 0, opacity: 0, rotate: -180 }}
    animate={{ scale: 1, opacity: 1, rotate: 0 }}
    exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
    transition={{ type: "spring", stiffness: 100, damping: 15, duration: 1 }}
    whileHover={{ scale: 1.1, rotate: 10 }}
    whileTap={{ scale: 0.9 }}
  />
);

const AppleTreeScene = ({ goToNextScene }) => {
  const [isPouring, setIsPouring] = useState(false);
  const [particles, setParticles] = useState([]);
  const [fallingWords, setFallingWords] = useState([]);
  const wordRefs = useRef({});
  const engineRef = useRef(Matter.Engine.create());
  const mousePos = useRef({ x: 0, y: 0 });
  const poemWordRefs = useRef({});

  const [showBlackhole, setShowBlackhole] = useState(false);
  const poemTextRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBlackhole(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    const { Bodies, World, Runner } = Matter;

    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 20, window.innerWidth, 60, {
      isStatic: true,
    });
    World.add(engine.world, [ground]);

    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Runner.stop(runner);
      World.clear(engine.world);
      Matter.Engine.clear(engine);
    };
  }, []);

  useEffect(() => {
    let animationFrameId;
    const renderLoop = () => {
      fallingWords.forEach((word) => {
        const ref = wordRefs.current[word.id];
        if (ref && word.body) {
          ref.style.transform = `translate(${word.body.position.x - 30}px, ${
            word.body.position.y - 20
          }px) rotate(${word.body.angle}rad)`;
        }
      });
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [fallingWords]);

  const addVisuals = useCallback(() => {
    setParticles((p) => [
      ...p.slice(-50),
      { id: Math.random(), x: mousePos.current.x, y: mousePos.current.y },
    ]);

    if (Math.random() < 0.1) {
      const { Bodies, World } = Matter;
      const newWordBody = Bodies.rectangle(mousePos.current.x, mousePos.current.y, 60, 40, {
        restitution: 0.3,
        friction: 0.8,
      });

      const newWord = {
        id: `word-${Date.now()}-${Math.random()}`,
        body: newWordBody,
      };

      World.add(engineRef.current.world, newWordBody);
      setFallingWords((w) => [...w, newWord]);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isPouring) {
      interval = setInterval(addVisuals, 50);
    }
    return () => clearInterval(interval);
  }, [isPouring, addVisuals]);

  const handleInteractionStart = (e) => {
    const event = e.touches ? e.touches[0] : e;
    mousePos.current = { x: event.clientX, y: event.clientY };
    setIsPouring(true);
  };

  const handleInteractionEnd = () => setIsPouring(false);

  const handleMouseMove = (e) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  };

  const collapsePoem = () => {
    if (!poemTextRef.current) return;

    const { Bodies, World } = Matter;
    const newFallingElements = [];

    // به جای پیمایش خطوط، مستقیماً کلمات را از رفرنس‌ها می‌خوانیم
    Object.values(poemWordRefs.current).forEach((wordElement) => {
      if (!wordElement) return; // اگر رفرنس هنوز ست نشده، رد شو

      const rect = wordElement.getBoundingClientRect();
      const wordText = wordElement.innerText;

      // اگر کلمه خالی است (مثلاً به خاطر space)، رد شو
      if (wordText.trim() === "") return;

      const body = Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        { restitution: 0.6, friction: 0.5, label: "poem_word" }
      );

      const newElement = {
        id: `word-${Math.random()}`,
        body: body,
        text: wordText,
      };

      World.add(engineRef.current.world, body);
      newFallingElements.push(newElement);
    });
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<< پایان بازنویسی کامل collapsePoem >>>>>>>>>>>>>>>>>>>>>>>

    setFallingWords((w) => [...w, ...newFallingElements]);
    poemTextRef.current.style.transition = "opacity 0.5s ease";
    poemTextRef.current.style.opacity = "0";
    setShowBlackhole(false);
  };

  const poemLines = [
    "آنجا که سیب‌های سرخِ رسیده",
    "در کمالِ لطافت می‌ریزند",
    "تو شیرین",
    "چگونه می‌شود",
    "نریخته باشی!؟",
  ];

  return (
    <motion.div
      className={styles.canvas}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onMouseMove={handleMouseMove}
      onTouchMove={(e) => handleMouseMove(e.touches[0])}
      onDoubleClick={goToNextScene}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, backgroundColor: isPouring ? "#FFF0F0" : "#f0edea" }}
      transition={{ duration: 2 }}
    >
      <AnimatePresence>
        {particles.map((p) => (
          <PoeticParticle key={p.id} x={p.x} y={p.y} />
        ))}
      </AnimatePresence>

      {fallingWords.map((word) => {
        const isPoemWord = word.body.label === "poem_word";

        return (
          <WordComponent key={word.id} ref={(el) => (wordRefs.current[word.id] = el)} isPoemWord={isPoemWord}>
            {isPoemWord ? word.text : "تو"}
          </WordComponent>
        );
      })}

      <div ref={poemTextRef} className={styles.poemText}>
        {poemLines.map((line, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: index * 2.5 + 2 }}
          >
            {line.split(" ").map((word, wordIndex) => (
              <span
                key={wordIndex}
                ref={(el) => (poemWordRefs.current[`${index}-${wordIndex}`] = el)}
                style={{ display: "inline-block", marginRight: "8px" }}
              >
                {word}
              </span>
            ))}{" "}
          </motion.p>
        ))}
      </div>
      <AnimatePresence>{showBlackhole && <Blackhole onClick={collapsePoem} />}</AnimatePresence>
    </motion.div>
  );
};
export default AppleTreeScene;
