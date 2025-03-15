import { useState, useEffect } from "react";
import styles from "./cardgame.module.scss";
import { PocketInner } from "./cardgame_component/pocket/pocket.tsx";

export function CardWindow() {
  const [username, setUsername] = useState(null);
  const [cardmode, setCardmode] = useState("");

  const handleStart = () => {
    const usernameInput = document.getElementById("username").value;
    setUsername(usernameInput);
  };
  const handleCardMode = (value) => {
    setCardmode(value);
  };

  return (
    <div className={styles.innerCardGame}>
      <div
        className={styles.innerCardGameBackground}
        style={
          !cardmode
            ? { backgroundImage: "url(img/cardgame/background-card.png)" }
            : {}
        }
      >
        {!username && !cardmode && (
          <div className={styles.innerEntry}>
            <h2>Card Game Simulator</h2>
            <input type="text" id="username" />
            <button onClick={handleStart}>Commencer</button>
          </div>
        )}
        {username && !cardmode && (
          <div className={styles.innerEntry}>
            <h2>Card Game Simulator</h2>
            <h3>Choisissez votre mode de jeu</h3>
            <div className={styles.gameMode}>
              <button onClick={() => handleCardMode("pocket")}>
                Pocket Monster
              </button>
              <button onClick={() => handleCardMode("magic")}>Magic</button>
              <button onClick={() => handleCardMode("yugioh")}>Yu-gi-oh</button>
            </div>
          </div>
        )}
        {cardmode == "pocket" ? (
          <PocketInner username={username} />
        ) : cardmode == "magic" ? (
          <magicInner />
        ) : cardmode == "yugioh" ? (
          <yugiInner />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
