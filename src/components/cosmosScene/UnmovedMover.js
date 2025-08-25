import React from "react";
import clsx from "clsx";
import styles from "./UnmovedMover.module.css";

// کامپوننتی برای تولید ذرات کمربند سیارک‌ها
const Debris = ({ index, total }) => {
  // توزیع ذرات در یک مسیر دایره‌ای با کمی پراکندگی تصادفی
  const angle = (index / total) * 360;
  const radius = 140 + (Math.random() - 0.5) * 10; // 140px شعاع با کمی انحراف
  const style = {
    "--angle": `${angle}deg`,
    "--radius": `${radius}px`,
    animationDelay: `${Math.random() * -25}s`, // تاخیر تصادفی برای انیمیشن سوسو زدن
  };
  return <div className={styles.debris} style={style}></div>;
};

const UnmovedMover = ({ isBlackhole = false }) => {
  const debrisCount = 50;
  console.log(isBlackhole);
  return (
    <div className={clsx(styles.container, { [styles.blackholeMode]: isBlackhole })}>
      {/* هسته مرکزی چندلایه و درخشان */}
      <div className={styles.core}></div>

      {/* مدار اول با یک سیاره ساده */}
      <div className={clsx(styles.orbit, styles.orbit1)}>
        <div className={styles.planet}></div>
      </div>

      {/* مدار دوم با یک دنباله‌دار */}
      <div className={clsx(styles.orbit, styles.orbit2)}>
        <div className={styles.comet}></div>
      </div>

      {/* کمربند سیارک‌ها */}
      <div className={clsx(styles.orbit, styles.debrisField)}>
        {Array.from({ length: debrisCount }).map((_, i) => (
          <Debris key={i} index={i} total={debrisCount} />
        ))}
      </div>

      {/* هاله‌های گازی و چرخشی */}
      <div className={clsx(styles.halo, styles.halo1)}></div>
      <div className={clsx(styles.halo, styles.halo2)}></div>
    </div>
  );
};

export default UnmovedMover;
