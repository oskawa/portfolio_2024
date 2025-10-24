import React from "react";
import styles from "../../quizz.module.scss";

export const ChatMessage = ({ message }) => {
  return (
    <div className={styles.innerChat}>
      <div className={styles.chatContent}>
        <p className={styles.chatMessage}>{message}</p>
      </div>
    </div>
  );
};
