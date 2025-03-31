"use client";
import { useState, useEffect } from "react";
import { ref, set, update, get, onValue } from "firebase/database";
import { database } from "../../../../firebase";
import { httpCard } from "../../../../axios/http";
import styles from "./game.module.scss";
import GameScreen from "./gamescreen";

const generateUUID = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 5 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};
type Deck = {
  username: string;
  game: string;
  name: string;
  cards: [];
};
type Player = {
  name: string;
  // Add other properties if necessary
};

export function CardGameLobby({ game, username, type }) {
  const [uuid, setUuid] = useState("");
  const [userDecks, setUserDecks] = useState([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [gameData, setGameData] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [joinUuid, setJoinUuid] = useState(""); // Separate state for joining
  const [playerId, setPlayerId] = useState("");

  const initialBoardState = {
    0: { name: "prize_cards", can: true, cards: [], multiple: true },
    1: { name: null, can: false },
    2: { name: null, can: false },
    3: { name: "active_card", can: true, cards: [], multiple: true },
    4: { name: null, can: false },
    5: { name: null, can: false },
    6: { name: "deck", can: true, cards: [], multiple: true },
    7: { name: null, can: false },
    8: { name: "bench_1", can: true, cards: "", multiple: false },
    9: { name: "bench_2", can: true, cards: "", multiple: false },
    10: { name: "bench_3", can: true, cards: "", multiple: false },
    11: { name: "bench_4", can: true, cards: "", multiple: false },
    12: { name: "bench_5", can: true, cards: "", multiple: false },
    13: { name: "discard", can: true, cards: [], multiple: true },
  };

  async function getUserDecks() {
    try {
      const response = await httpCard.get("userdeck", {
        params: { game, username, array: "array" },
      });

      setUserDecks(response.data || []);
    } catch (error) {
      console.error("Error fetching user decks:", error);
    }
  }
  useEffect(() => {
    getUserDecks();
  }, [game, username]);

  const selectDeck = async (deck: Deck) => {
    setCurrentDeck(deck);
  };

  const shuffleArray = (array) => {
    let shuffled = [...array]; // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  };

  useEffect(() => {
    if (!uuid) return;
    const gameRef = ref(database, `games/${uuid}`);

    const unsubscribe = onValue(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const newData = snapshot.val();
        setGameData(newData);
      }
    });

    return () => unsubscribe();
  }, [uuid]);

  const createGame = async () => {
    const newUuid = generateUUID();
    setUuid(newUuid);
    setIsCreator(true); // Mark the user as the creator
    const gameRef = ref(database, `games/${newUuid}`);

    const gameData = {
      game: "pocketmonster",
      global: {
        hasbegin: false,
        hastwoplayers: false,
        total_player_authorized: 2,
      },
      players: {
        player1: {
          name: username || "Player 1",
          cards: shuffleArray(currentDeck["cards"]),
          hand: [],
          discard: [],
          active_spot: [],
          bench: [],
          prize_cards: [],
          board: initialBoardState, // Initialize the board state for player1
        },
      },
    };

    await set(gameRef, gameData);
    setPlayerId("player1"); // Set as the first player
  };

  const joinGame = async () => {
    if (!joinUuid) return alert("Enter a game UUID!");
    const gameRef = ref(database, `games/${joinUuid}`);

    const snapshot = await get(gameRef);
    if (!snapshot.exists()) {
      return alert("Game not found!");
    }

    const game = snapshot.val();
    if (Object.keys(game.players).length >= 2) {
      return alert("Game is full!");
    }

    setUuid(joinUuid); // Set the correct UUID after joining
    setPlayerId("player2");
    const updatedPlayers = {
      ...game.players,
      player2: {
        name: username || "Player 2",
        cards: shuffleArray(currentDeck["cards"]),
        board: initialBoardState, // Initialize the board state for player2
        hand: [],
        discard: [],
        active_spot: [],
        bench: [],
        prize_cards: [],
      },
    };

    const updates = {
      [`games/${joinUuid}/players`]: updatedPlayers,
      [`games/${joinUuid}/global/hastwoplayers`]: true,
    };

    await update(ref(database), updates);
  };

  const startGame = async () => {
    if (!uuid || !gameData) return;
    const gameRef = ref(database, `games/${uuid}/global`);

    await update(gameRef, { hasbegin: true });
  };

  return (
    <div className={styles.innerGame}>
      {!uuid ? (
        <div className={styles.createGame}>
          <h2>Card Game Lobby</h2>
          {userDecks.length > 0 ? (
            <div>
              <h3>Choix du deck :</h3>
              <ul className={styles.deckList}>
                {userDecks.map((deck: Deck, index) => (
                  <li key={index}>
                    <button
                      className={deck === currentDeck ? styles.active : ""}
                      onClick={() => selectDeck(deck)}
                    >
                      {deck.name || "Unnamed Deck"}{" "}
                    </button>
                  </li>
                ))}
              </ul>
              <hr />
            </div>
          ) : (
            ""
          )}
          <button
            onClick={createGame}
            className={`${styles.create} ${currentDeck ? styles.active : ""}`}
          >
            Créer une partie
          </button>
          <p>OU</p>
          <p>Game Code: {uuid}</p>

          <input
            type="text"
            placeholder="Entrer code"
            value={joinUuid}
            onChange={(e) => setJoinUuid(e.target.value.toUpperCase())}
          />

          <button
            className={`${styles.create} ${currentDeck ? styles.active : ""}`}
            onClick={joinGame}
          >
            Rejoindre une partie
          </button>
        </div>
      ) : (
        <>
          <div className={styles.informations}>
            <p>
              Game Code: <strong>{uuid}</strong>
            </p>
            {gameData && (
              <div className={styles.informationsGame}>
                <h3>Players:</h3>
                <ul>
                  {Object.values(gameData.players).map((player:Player, index) => (
                    <li key={index}>{player.name}</li>
                  ))}
                </ul>

                {gameData.global.hastwoplayers &&
                  isCreator &&
                  !gameData?.global?.hasbegin && (
                    <button onClick={startGame}>Start Game</button>
                  )}
              </div>
            )}
          </div>
        </>
      )}

      {gameData?.global?.hasbegin && (
        <GameScreen uuid={uuid} playerId={playerId} />
      )}
    </div>
  );
}
