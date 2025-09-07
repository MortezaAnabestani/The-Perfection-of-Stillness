import React from "react";
import clsx from "clsx";
import styles from "./UnmovedMover.module.css";

const Debris = ({ index, total }) => {
  const angle = (index / total) * 360;
  const radius = 140 + (Math.random() - 0.5) * 10;
  const style = {
    "--angle": `${angle}deg`,
    "--radius": `${radius}px`,
    animationDelay: `${Math.random() * -25}s`,
  };
  return <div className={styles.debris} style={style}></div>;
};

const UnmovedMover = ({ isBlackhole = false }) => {
  const debrisCount = 50;
  console.log(isBlackhole);
  return (
    <div className={clsx(styles.container, { [styles.blackholeMode]: isBlackhole })}>
      <div className={styles.core}></div>

      <div className={clsx(styles.orbit, styles.orbit1)}>
        <div className={styles.planet}></div>
      </div>

      <div className={clsx(styles.orbit, styles.orbit2)}>
        <div className={styles.comet}></div>
      </div>

      <div className={clsx(styles.orbit, styles.debrisField)}>
        {Array.from({ length: debrisCount }).map((_, i) => (
          <Debris key={i} index={i} total={debrisCount} />
        ))}
      </div>

      <div className={clsx(styles.halo, styles.halo1)}></div>
      <div className={clsx(styles.halo, styles.halo2)}></div>
    </div>
  );
};

export default UnmovedMover;
