import React, { useState, useEffect, useRef } from "react";
import styles from "./horse.module.scss";
import { ref, set, update, get, onValue } from "firebase/database";
import { database } from "../../../firebase";

const PLAYER_COLORS = [
  "#FF4444", // Rouge
  "#44FF44", // Vert
  "#4444FF", // Bleu
  "#FFFF44", // Jaune
  "#FF44FF", // Magenta
  "#44FFFF", // Cyan
];

// Liste temporaire des 15 mots (à remplacer plus tard)
const WORD_LISTS = {
  easy: [
    "chat",
    "maison",
    "soleil",
    "pain",
    "livre",
    "table",
    "chaise",
    "porte",
    "main",
    "pied",
    "tête",
    "cœur",
    "eau",
    "feu",
    "air",
    "mer",
    "lac",
    "arbre",
    "fleur",
    "lune",
    "jour",
    "nuit",
    "ami",
    "temps",
    "ville",
    "enfant",
    "parent",
    "chien",
    "oiseau",
    "poisson",
  ],

  medium: [
    "ordinateur",
    "telephone",
    "universite",
    "ellement",
    "difficile",
    "montagne",
    "jardin",
    "fenêtre",
    "cuisine",
    "voiture",
    "papillon",
    "aventure",
    "histoire",
    "musique",
    "peinture",
    "fortable",
    "important",
    "intéressant",
    "septembre",
    "octobre",
    "français",
    "anglais",
    "espagnol",
    "restaurant",
    "magasin",
    "directeur",
    "professeur",
    "étudiant",
    "question",
    "réponse",
  ],

  hard: [
    "anticonstitutionnellement",
    "chrysantheme",
    "cacahuete",
    "yaourt",
    "oignon",
    "parallélépipède",
    "pneumatique",
    "œsophage",
    "philosophie",
    "psychologie",
    "hypothèse",
    "synthèse",
    "analyse",
    "développement",
    "environnement",
    "extraordinaire",
    "infrastructure",
    "photographie",
    "chorégraphie",
    "bibliothèque",
    "archéologie",
    "anesthésie",
    "architecture",
    "chromosome",
    "chirurgien",
    "pharmaceutique",
    "métamorphose",
    "parachute",
    "orchestre",
    "manœuvre",
  ],
};

function RaceTrack({ players }) {
  const trackWidth = 582; // Largeur du pattern
  const trackHeight = 478; // Hauteur du pattern
  const numTracks = 6; // Nombre de lignes
  const repeatsHorizontal = 25; // Nombre de répétitions horizontales

  return (
    <div className={styles.raceInner}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundImage: "url(/img/horses/background.png)",
          backgroundSize: "contain",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center top",
          overflow: "hidden",
        }}
      >
        {/* Lignes de course (pattern répété) */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "64%",
            bottom: 0,
          }}
        >
          {Array.from({ length: numTracks }).map((_, trackIndex) => {
            const opacity = 1 - trackIndex * 0.1;
            const player = players ? Object.values(players)[trackIndex] : null;
            const progress = player?.progress || 0;

            return (
              <div
                key={trackIndex}
                style={{
                  position: "absolute",
                  height: `${100 / numTracks + 10}%`,
                  bottom: `${0 + 15 * trackIndex}%`,
                  zIndex: `${6 - trackIndex}`,
                  width: "100%",
                  transformOrigin: "center top",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Pattern de sol répété horizontalement */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: "80%",
                    width: "100%",
                    display: "flex",
                    opacity: 1,
                  }}
                >
                  {Array.from({ length: repeatsHorizontal }).map((_, i) => (
                    <img
                      key={i}
                      src="/img/horses/grass.png"
                      alt=""
                      style={{
                        height: "100%",
                        width: "auto",
                        objectFit: "cover",
                        filter: `brightness(${1 - trackIndex * 0.15})`, // De plus en plus sombre
                      }}
                    />
                  ))}
                </div>

                {/* Cheval du joueur (si présent) */}
                {player && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${2 + progress * 0.88}%`,
                      top: "0%",
                      transform: "translateY(-50%)",
                      width: "100px",
                      height: "100px",
                      zIndex: -1 - trackIndex,
                      transition: "left 0.5s ease-out",
                    }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      style={{
                        width: "100%",
                        height: "100%",

                        filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
                      }}
                    >
                      <use
                        href="/img/horses/horse.svg#horse"
                        fill={player.color}
                      />
                    </svg>

                    {/* Nom du joueur */}
                    <div
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "0",

                        background: player.color,
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      {player.name}
                    </div>
                  </div>
                )}

                {/* Ligne d'arrivée */}
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              right: "5%",
              top: 0,
              bottom: 0,
              width: "4px",
              background:
                "repeating-linear-gradient(0deg, #000 0px, #000 20px, #fff 20px, #fff 40px)",
              zIndex: 100,
              height: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
function GameInterface({ gameData, playerId, uuid, stopGame, isCreator }) {
  const [inputValue, setInputValue] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [isError, setIsError] = useState(false);
  const inputRef = useRef(null);

  const player = gameData.players[playerId];
  const currentWordIndex = player.currentWordIndex;
  const currentWord = gameData.global.words[currentWordIndex];
  const totalWords = gameData.global.words.length;
  const progress = (currentWordIndex / totalWords) * 100;

  useEffect(() => {
    if (gameData.global.status === "playing" && !startTime) {
      setStartTime(Date.now());
    }
  }, [gameData.global.status]);

  useEffect(() => {
    if (inputRef.current && gameData.global.status === "playing") {
      inputRef.current.focus();
    }
  }, [gameData.global.status]);

  const handleKeyPress = async (e) => {
    if (e.key !== "Enter") return;

    const trimmedInput = inputValue.trim();

    if (trimmedInput === currentWord) {
      const newWordIndex = currentWordIndex + 1;
      const newProgress = (newWordIndex / totalWords) * 100;

      // Si c'est le dernier mot, enregistrer le temps
      if (newWordIndex >= totalWords) {
        const finishTime = Date.now() - startTime;
        await update(ref(database, `games/${uuid}/players/${playerId}`), {
          currentWordIndex: newWordIndex,
          progress: 100,
          finishTime: finishTime,
        });
      } else {
        await update(ref(database, `games/${uuid}/players/${playerId}`), {
          currentWordIndex: newWordIndex,
          progress: newProgress,
        });
      }

      setInputValue("");
      setIsError(false);
    } else {
      setIsError(true);
      setInputValue("");
      setTimeout(() => setIsError(false), 500);
    }
  };

  if (player.finishTime) {
    const allFinished = Object.values(gameData.players).every(
      (p) => p.finishTime !== null
    );

    if (allFinished) {
      const rankings = Object.entries(gameData.players)
        .filter(([_, p]) => p.finishTime !== null)
        .sort((a, b) => a[1].finishTime - b[1].finishTime)
        .map(([pid, p], index) => ({ rank: index + 1, playerId: pid, ...p }));

      const myRank = rankings.find((r) => r.playerId === playerId);

      return (
        <div className={styles.interface} style={{ minWidth: "600px" }}>
          <h2
            style={{ color: "#44ff44", marginBottom: "20px", fontSize: "2em" }}
          >
            🏆 Fin de la course !
          </h2>

          <div
            style={{
              background: "#f5f5f5",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Classement</h3>
            {rankings.map((r) => (
              <div
                key={r.playerId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: r.playerId === playerId ? "#e3f2fd" : "white",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  border:
                    r.playerId === playerId ? "2px solid #1E4B28" : "none",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{
                      fontSize: "1.5em",
                      fontWeight: "bold",
                      width: "30px",
                    }}
                  >
                    {r.rank === 1
                      ? "🥇"
                      : r.rank === 2
                      ? "🥈"
                      : r.rank === 3
                      ? "🥉"
                      : `${r.rank}.`}
                  </span>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: r.color,
                    }}
                  />
                  <span style={{ fontWeight: "bold" }}>
                    {r.name} {r.playerId === playerId && "(Vous)"}
                  </span>
                </div>
                <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                  {(r.finishTime / 1000).toFixed(2)}s
                </span>
              </div>
            ))}

            <button
              onClick={stopGame}
              style={{
                width: "100%",
                padding: "15px",
                fontSize: "18px",
                fontWeight: "bold",
                background: "#1E4B28",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {isCreator ? "Retour au lobby" : "En attente de l'admin..."}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.interface}>
        <h2 style={{ color: "#44ff44", marginBottom: "20px", fontSize: "2em" }}>
          Terminé !
        </h2>
        <p style={{ fontSize: "1.5em", color: "#333" }}>
          Votre temps :{" "}
          <strong>{(player.finishTime / 1000).toFixed(2)}s</strong>
        </p>
        <p style={{ color: "#666", marginTop: "10px" }}>
          En attente des autres joueurs...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.interface}>
      {/* Progression */}
      <div style={{ marginBottom: "20px" }}>
        <div className={styles.progressBar}>
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: player.color,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Mot à taper */}
      <div
        style={{
          fontSize: "2.5em",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "20px",
          minHeight: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {currentWord}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "1.5em",
          border: isError ? "3px solid #ff4444" : "3px solid #ddd",
          borderRadius: "10px",
          textAlign: "center",
          outline: "none",
          transition: "border-color 0.2s",
          background: isError ? "#ffe0e0" : "white",
        }}
        placeholder="Tapez le mot..."
      />

      <div className={styles.howto}>Appuyez sur Entrée pour valider</div>
    </div>
  );
}

function CountdownOverlay({ countdown }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          fontSize: "10em",
          fontWeight: "bold",
          color: "white",
          animation: "pulse 1s ease-in-out",
        }}
      >
        {countdown}
      </div>
    </div>
  );
}

export function HorseWindow() {
  const [uuid, setUuid] = useState(null);
  const [joinUuid, setJoinUuid] = useState("");
  const [username, setUsername] = useState("");
  const [playerId, setPlayerId] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (!uuid) return;

    const gameRef = ref(database, `games/${uuid}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        setGameData(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, [uuid]);

  const generateUUID = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 5 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  useEffect(() => {
    if (gameData?.global?.status === "countdown") {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (isCreator) {
              update(ref(database, `games/${uuid}/global`), {
                status: "playing",
              });
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameData?.global?.status]);

  const createGame = async () => {
    if (!username.trim()) {
      alert("Veuillez entrer votre pseudo !");
      return;
    }

    const newUuid = generateUUID();
    const newPlayerId = "player1";

    // Générer la liste des 15 mots

    function selectRandomWords(list, count) {
      const shuffled = [...list].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    }

    const allWords = [
      ...selectRandomWords(WORD_LISTS.easy, 5),
      ...selectRandomWords(WORD_LISTS.medium, 5),
      ...selectRandomWords(WORD_LISTS.hard, 5),
    ];

    const gameData = {
      game: "horserace",
      global: {
        total_player_authorized: 6,
        min_players: 1,
        status: "waiting",
        startTime: null,
        words: allWords,
      },
      players: {
        [newPlayerId]: {
          name: username,
          color: PLAYER_COLORS[0],
          ready: false,
          currentWordIndex: 0,
          finishTime: null,
          position: 0,
        },
      },
      results: null,
    };

    await set(ref(database, `games/${newUuid}`), gameData);

    setUuid(newUuid);
    setPlayerId(newPlayerId);
    setIsCreator(true);
    setGameData(gameData);
  };

  const joinGame = async () => {
    if (!username.trim()) {
      alert("Veuillez entrer votre pseudo !");
      return;
    }

    if (!joinUuid.trim()) {
      alert("Entrez un ID de partie !");
      return;
    }

    const snapshot = await get(ref(database, `games/${joinUuid}`));
    const game = snapshot.val();

    if (!game) {
      alert("Partie introuvable !");
      return;
    }

    const playerCount = Object.keys(game.players).length;

    if (playerCount >= 6) {
      alert("La partie est pleine !");
      return;
    }

    if (game.global.status !== "waiting") {
      alert("La partie a déjà commencé !");
      return;
    }

    const newPlayerId = `player${playerCount + 1}`;

    await update(ref(database, `games/${joinUuid}/players`), {
      [newPlayerId]: {
        name: username,
        color: PLAYER_COLORS[playerCount],
        ready: false,
        currentWordIndex: 0,
        finishTime: null,
        position: playerCount,
      },
    });

    game.players[newPlayerId] = {
      name: username,
      color: PLAYER_COLORS[playerCount],
      ready: false,
      currentWordIndex: 0,
      finishTime: null,
      position: playerCount,
    };

    setUuid(joinUuid);
    setPlayerId(newPlayerId);
    setGameData(game);
  };

  const toggleReady = async () => {
    if (!gameData || !playerId) return;

    const updatedGameData = { ...gameData };
    updatedGameData.players[playerId].ready =
      !updatedGameData.players[playerId].ready;

    await set(ref(database, `games/${uuid}`), updatedGameData);
    setGameData(updatedGameData);
  };

  const startGame = async () => {
    if (!isCreator || !gameData) return;

    const allReady = Object.values(gameData.players).every((p) => p.ready);

    if (!allReady) {
      alert("Tous les joueurs doivent être prêts !");
      return;
    }

    await update(ref(database, `games/${uuid}/global`), {
      status: "countdown",
      startTime: Date.now(),
    });
  };

  const stopGame = async () => {
    if (!isCreator) return;

    // Reset tous les joueurs
    const resetPlayers = {};
    Object.keys(gameData.players).forEach((pid) => {
      resetPlayers[pid] = {
        ...gameData.players[pid],
        ready: false,
        currentWordIndex: 0,
        finishTime: null,
        progress: 0,
      };
    });

    await update(ref(database, `games/${uuid}`), {
      "global/status": "waiting",
      players: resetPlayers,
      results: null,
    });
  };

  // Vérifier si tous les joueurs ont fini
  const allPlayersFinished =
    gameData &&
    Object.values(gameData.players).every((p) => p.finishTime !== null);

  // Calculer le classement
  const getRankings = () => {
    if (!gameData) return [];
    return Object.entries(gameData.players)
      .filter(([_, player]) => player.finishTime !== null)
      .sort((a, b) => a[1].finishTime - b[1].finishTime)
      .map(([pid, player], index) => ({
        rank: index + 1,
        playerId: pid,
        ...player,
      }));
  };

  const leaveGame = () => {
    setUuid(null);
    setPlayerId(null);
    setGameData(null);
    setIsCreator(false);
  };
  const showLobby = gameData?.global?.status === "waiting";

  return (
    <div className={styles.content}>
      {!uuid ? (
        // Écran de création/join
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            maxWidth: "500px",
            width: "90%",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              color: "#1E4B28",
              marginBottom: "30px",
              fontSize: "2.5em",
            }}
          >
            Course de Chevaux
          </h1>

          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Votre pseudo :
            </label>
            <input
              type="text"
              placeholder="Entrez votre nom"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={createGame}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "18px",
              fontWeight: "bold",
              background: "#1E4B28",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "15px",
            }}
          >
            Créer une partie
          </button>

          <div style={{ textAlign: "center", margin: "20px 0", color: "#999" }}>
            OU
          </div>

          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Code de partie"
              value={joinUuid}
              onChange={(e) => setJoinUuid(e.target.value.toUpperCase())}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
                marginBottom: "28px",
              }}
            />
            <button
              onClick={joinGame}
              style={{
                width: "100%",
                padding: "15px",
                fontSize: "18px",
                fontWeight: "bold",
                background: "#65B376",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Rejoindre
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.raceContent}>
            <RaceTrack players={gameData?.players} />
            {countdown !== null && <CountdownOverlay countdown={countdown} />}
          </div>
          {isCreator &&
            (gameData?.global?.status === "playing" ||
              gameData?.global?.status === "countdown") && (
              <button
                onClick={stopGame}
                style={{
                  position: "absolute",
                  top: "30px",
                  right: "20px",
                  padding: "10px 20px",
                  background: "#ff4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  zIndex: 11,
                  fontWeight: "bold",
                }}
              >
                Arrêter la partie
              </button>
            )}
          {gameData?.global?.status === "playing" && (
            <GameInterface
              key={gameData.global.startTime} // Force la recréation du composant
              gameData={gameData}
              playerId={playerId}
              uuid={uuid}
              isCreator={isCreator}
              stopGame={stopGame}
            />
          )}

          {showLobby && (
            <div
              style={{
                position: "absolute",
                zIndex: 15,

                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                maxWidth: "700px",
                width: "90%",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "30px",
                }}
              >
                <div>
                  <h2 style={{ color: "#1E4B28", margin: "0 0 10px 0" }}>
                    Salon de course
                  </h2>
                  <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                    Code :{" "}
                    <strong style={{ fontSize: "18px", color: "#764ba2" }}>
                      {uuid}
                    </strong>
                  </p>
                </div>
                <button
                  onClick={leaveGame}
                  style={{
                    padding: "10px 20px",
                    background: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Quitter
                </button>
              </div>

              <div
                style={{
                  background: "#f5f5f5",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ marginTop: 0, color: "#333" }}>
                  Joueurs ({gameData ? Object.keys(gameData.players).length : 0}
                  /6)
                </h3>

                {gameData &&
                  Object.entries(gameData.players).map(([pid, player]) => (
                    <div
                      key={pid}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px",
                        background: "white",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        border:
                          pid === playerId
                            ? "2px solid #667eea"
                            : "2px solid transparent",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            background: player.color,
                          }}
                        />
                        <span style={{ fontWeight: "bold" }}>
                          {player.name} {pid === playerId && "(Vous)"}
                        </span>
                      </div>

                      {player.ready ? (
                        <span style={{ color: "#44ff44", fontWeight: "bold" }}>
                          ✓ Prêt
                        </span>
                      ) : (
                        <span style={{ color: "#ff4444" }}>En attente...</span>
                      )}
                    </div>
                  ))}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={toggleReady}
                  style={{
                    flex: 1,
                    padding: "15px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    background: gameData?.players?.[playerId]?.ready
                      ? "#ff9944"
                      : "#44ff44",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  {gameData?.players?.[playerId]?.ready ? "Pas prêt" : "Prêt !"}
                </button>

                {isCreator && (
                  <button
                    onClick={startGame}
                    style={{
                      flex: 1,
                      padding: "15px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      background: "#1E4B28",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Lancer la partie
                  </button>
                )}
              </div>

              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",

                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "grey",
                }}
              >
                <strong>Règles :</strong> Tapez correctement les 15 mots le plus
                vite possible. Validez avec Entrée. Le plus rapide gagne !
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
