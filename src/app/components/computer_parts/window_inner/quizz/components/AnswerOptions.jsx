import React from "react";
import styles from "../../quizz.module.scss";

export const AnswerOptions = ({
  answers,
  selectedAnswer,
  result,
  removedAnswers,
  onAnswerClick,
  onSubmit,
}) => {
  return (
    <div className={styles.responses}>
      {answers.map((ans) => {
        const isRemoved = removedAnswers.includes(ans);

        return (
          <div
            className={`${styles.responsesInner} ${
              selectedAnswer === ans ? styles.checked : ""
            } ${
              result !== null ? (result ? styles.correct : styles.wrong) : ""
            } ${isRemoved ? styles.removed : ""}`}
            key={ans}
            onClick={() => !isRemoved && onAnswerClick(ans)}
            style={isRemoved ? { pointerEvents: "none" } : {}}
          >
            <label className={styles.responsesLabel}>
              <input
                type="radio"
                value={ans}
                checked={selectedAnswer === ans}
                onChange={() => {}}
                disabled={isRemoved}
              />
              {!isRemoved && ans}
            </label>
          </div>
        );
      })}
      <button
        className={styles.buttonsValidate}
        onClick={onSubmit}
        disabled={!selectedAnswer}
      >
        <svg
          width="19"
          height="16"
          viewBox="0 0 19 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.21 15.54L0 9.33L2.83 6.5L6.21 9.89L16.09 0L18.92 2.83L6.21 15.54Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
};
