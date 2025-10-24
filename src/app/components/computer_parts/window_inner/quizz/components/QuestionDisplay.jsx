import React from "react";
import styles from "../../quizz.module.scss";

export const QuestionDisplay = ({ question }) => {
  return (
    <div className={styles.questionWrapper}>
      <div className={styles.question}>
        <span>{question}</span>
      </div>
    </div>
  );
};
