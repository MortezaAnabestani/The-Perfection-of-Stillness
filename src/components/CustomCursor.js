import React, { useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import styles from "./CustomCursor.module.css";

const CustomCursor = () => {
  const cursorCount = 10;

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursors = useMemo(
    () =>
      Array.from({ length: cursorCount }).map((_, i) => {
        const springConfig = { damping: 25, stiffness: 500, mass: 0.1 };
        const stiffness = springConfig.stiffness - i * 40;
        const damping = springConfig.damping + i * 2;
        return {
          x: mouseX,
          y: mouseY,
          springConfig: { ...springConfig, stiffness, damping },
        };
      }),
    [mouseX, mouseY]
  );

  const CursorDot = ({ x, y, springConfig, index }) => {
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    return (
      <motion.div
        className={styles.cursor}
        style={{
          x: springX,
          y: springY,
          scale: 1 - index * 0.08,
          opacity: 1 - index * 0.08,
        }}
      />
    );
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {cursors.map((cursor, index) => (
        <CursorDot key={index} x={cursor.x} y={cursor.y} springConfig={cursor.springConfig} index={index} />
      ))}
    </>
  );
};

export default CustomCursor;
