import React from "react";
import styles from "../../quizz.module.scss";

export const PublicVoteModal = ({ show, answserList, publicVote }) => {
  if (!show || !publicVote) return null;
  const labels = ['A', 'B', 'C', 'D'];
  const sortedVotes = answserList.map(answer => ({
    answer,
    percentage: publicVote[answer] || 0
  }));

  console.log(sortedVotes)
  return (
    <div className={`${styles.publicModal} ${styles.active}`}>
      <div className={styles.publicModalTotal}>
        {sortedVotes.map(({ answer, percentage }, index) => (

          <div key={answer} className={styles.voteBar}>
            <div className={styles.voteLabel}>{labels[index]}</div>
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