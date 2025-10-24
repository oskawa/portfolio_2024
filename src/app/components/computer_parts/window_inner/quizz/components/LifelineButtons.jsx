import React from "react";
import styles from "../../quizz.module.scss";

export const LifelineButtons = ({ onUseLifeline, usedLifelines }) => {
  return (
    <div className={styles.innerCounterFindings}>
      <div
        className={`${styles.innerFindings} ${
          usedLifelines.includes("phone") ? styles.used : ""
        }`}
        onClick={() => onUseLifeline("phone")}
      >
        Tel
      </div>
      <div
        className={`${styles.innerFindings} ${
          usedLifelines.includes("fifty") ? styles.used : ""
        }`}
        onClick={() => onUseLifeline("fifty")}
      >
        50/50
      </div>
      <div
        className={`${styles.innerFindings} ${
          usedLifelines.includes("public") ? styles.used : ""
        }`}
        onClick={() => onUseLifeline("public")}
      >
        Public
      </div>
    </div>
  );
};
