import React from "react";
import { motion, useTransform } from "framer-motion";

const DriftingParticle = ({ mouseX, mouseY }) => {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;

  const transformedX = useTransform(mouseX, (latestX) => x + (latestX - x) * 0.3);
  const transformedY = useTransform(mouseY, (latestY) => y + (latestY - y) * 0.3);

  return (
    <motion.div
      style={{
        position: "absolute",
        width: 1 + Math.random() * 2,
        height: 1 + Math.random() * 2,
        backgroundColor: `hsla(${180 + Math.random() * 100}, 100%, 80%, ${0.2 + Math.random() * 0.3})`,
        borderRadius: "50%",
        x: transformedX,
        y: transformedY,
      }}
    />
  );
};
export default DriftingParticle;
