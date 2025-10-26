import React from "react";
import styles from "../../quizz.module.scss";

export const CategoryScreen = ({
  categories,
  onToggleCategory,
  onContinue,
  onBack,
  onEnableAudio,
}) => {
  const handleContinue = () => {
    onEnableAudio();
    onContinue();
  };

  const handleBack = () => {
    onEnableAudio();
    onBack();
  };

  return (
    <>
     
      <div className={styles.menu}>
        <h3>Choisir les catégories</h3>
        {categories.map((cat) => (
          <label key={cat.id}>
            <input
              type="checkbox"
              checked={cat.checked}
              onChange={() => onToggleCategory(cat.id)}
            />
            {cat.name}
          </label>
        ))}
        <button onClick={handleContinue}>Continue</button>
        <button onClick={handleBack} style={{ marginLeft: "10px" }}>
          Retour
        </button>
      </div>
    </>
  );
};
