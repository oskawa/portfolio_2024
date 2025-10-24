import React from "react";
import styles from "../../quizz.module.scss";
import { SceneCanvas } from "./SceneCanvas";

export const MenuScreen = ({ onStart, onCategorySelect, onEnableAudio }) => {
  const handleStart = () => {
    onEnableAudio();
    onStart();
  };

  const handleCategory = () => {
    onEnableAudio();
    onCategorySelect();
  };

  return (
    <>
      <SceneCanvas
        targetPosition={[0, 2, 5]}
        style={{ width: "100%", height: "97.7%", position: "absolute" }}
      />
      <div className={styles.menu}>
        <div className={styles.title__Inner}>
          <h2>Qui veut devenir un champion ?</h2>
          <div className={styles.buttonsMenu}>
            <button onClick={handleStart}>Commencer</button>
            <button onClick={handleCategory}>Choisir les catégories</button>
          </div>
        </div>
      </div>
    </>
  );
};
