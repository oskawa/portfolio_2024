import { useState, useEffect } from "react";
import { Decks } from "../decks";
import styles from "./pocket.module.scss";
export function PocketInner({ username }) {
  const [view, setView] = useState(null);

  const handleView = (value) => {
    setView(value);
  };
  return (
    <>
      <div>
        <div className={styles.topMenu}>
          <h3>POCKET MONSTER</h3>
          <button onClick={() => handleView("create")}>Créer une partie</button>
          <button onClick={() => handleView("join")}>
            Rejoindre une partie
          </button>
          <button onClick={() => handleView("decks")}>Mes deck</button>
        </div>
      </div>
      {view == "decks" && (
        <>
          <Decks game={"pocket"} username={username} />
        </>
      )}
    </>
  );
}
