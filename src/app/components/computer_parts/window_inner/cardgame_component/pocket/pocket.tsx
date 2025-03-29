import { useState, useEffect } from "react";
import { Decks } from "../decks";
import { CardGameLobby } from "../game";
import styles from "./pocket.module.scss";
export function PocketInner({ username }: { username: string }) {
  const [view, setView] = useState("create");

  const handleView = (value: string) => {
    setView(value);
  };
  return (
    <>
      <div>
        <div className={styles.topMenu}>
          <h3>POCKET MONSTER</h3>
          <button onClick={() => handleView("create")}>Créer/Rejoindre une partie</button>
         
          <button onClick={() => handleView("decks")}>Mes deck</button>
        </div>
      </div>
      {view == "decks" && (
        <>
          <Decks game={"pocket"} username={username} />
        </>
      )}
      {view == "create" && (
        <>
          <CardGameLobby game={"pocket"} username={username} type={"create"} />
        </>
      )}
    </>
  );
}
