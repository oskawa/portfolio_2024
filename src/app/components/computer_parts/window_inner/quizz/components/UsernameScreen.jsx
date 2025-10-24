import React from "react";
import styles from "../../quizz.module.scss";
import { SceneCanvas } from "./SceneCanvas";

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
      <SceneCanvas
        targetPosition={[-2, 2, 4]}
        showOrbitControls={true}
        style={{ width: "100%", height: "97.7%", position: "absolute" }}
      />
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
