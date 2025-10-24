import React from "react";
import styles from "../../quizz.module.scss";

export const PublicVoteModal = ({ show, publicVote }) => {
  if (!show || !publicVote) return null;

  return (
    <div className={`${styles.publicModal} ${styles.active}`}>
      <div className={styles.publicModalTotal}>
        {Object.entries(publicVote).map(([answer, percentage]) => (
          <div key={answer} className={styles.voteBar}>
            <div className={styles.voteLabel}>{answer}</div>
            <div className={styles.voteBarContainer}>
              <div
                className={styles.voteBarFill}
                style={{ height: `${percentage}%` }}
              >
                <span className={styles.votePercentage}>{percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};