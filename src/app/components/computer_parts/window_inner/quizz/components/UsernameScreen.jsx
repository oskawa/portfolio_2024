import React from "react";
import styles from "../../quizz.module.scss";

export const UsernameScreen = ({
  username,
  onUsernameChange,
  onContinue,
  onEnableAudio,
}) => {
  const handleContinue = () => {
    onEnableAudio();
    onContinue();
  };

  return (
    <>
      
      <div className={styles.menu}>
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Username"
        />
        <button onClick={handleContinue} disabled={!username}>
          Continue
        </button>
      </div>
    </>
  );
};
