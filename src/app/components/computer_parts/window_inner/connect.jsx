"use client";
import { useState, useEffect } from "react";
import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, Debug, usePlane, useCylinder } from "@react-three/cannon";
import styles from "./connect.module.scss";
import { GameBoard } from "./connectfour/board";
import { BoardPhysicsStructure } from "./connectfour/boardPhysics";
import { Coin } from "./connectfour/coin";
import { CoinHover } from "./connectfour/coinHover";
import { Plane } from "./connectfour/plane";
import { ClickToDrop } from "./connectfour/click";
import { ref, set, update, get, onValue } from "firebase/database";
import { database } from "../../../firebase";
import * as THREE from "three";

export function ConnectWindows() {
  const [coins, setCoins] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [uuid, setUuid] = useState(null); // Game ID
  const [joinUuid, setJoinUuid] = useState(""); // User input to join a game
  const [isCreator, setIsCreator] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [username, setUsername] = useState(""); // Player's name
  const [isDropping, setIsDropping] = useState(false); // Prevent multiple drops
  const [opponentHoverColumn, setOpponentHoverColumn] = useState(null);
  const skyboxImages = [
    "gltf/skybox/clouds1_east.jpg",
    "gltf/skybox/clouds1_west.jpg",
    "gltf/skybox/clouds1_up.jpg",
    "gltf/skybox/clouds1_down.jpg", // OK
    "gltf/skybox/clouds1_north.jpg",
    "gltf/skybox/clouds1_south.jpg",
  ];

  const cubeTexture = new THREE.CubeTextureLoader().load(skyboxImages);

  const generateUUID = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 5 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const createGame = async () => {
    const newUuid = generateUUID();
    setUuid(newUuid);
    setIsCreator(true);
    setPlayerId("player1");

    const gameRef = ref(database, `games/${newUuid}`);

    const gameData = {
      game: "powerfour",
      global: {
        total_player_authorized: 2,
        hasTwoPlayers: false,
      },
      players: {
        player1: {
          name: username || "Player 1",
          color: "red",
        },
      },
      coins: [],
    };
    await set(gameRef, gameData);
    setPlayerId("player1"); // Set as the first player
  };

  const beginGame = async () => {
    if (!uuid) return alert("P'tit problème !");

    const updates = {
      [`games/${uuid}/coins`]: [],
    };

    await update(ref(database), updates);
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

    setUuid(joinUuid);
    setPlayerId("player2");
    const updatedPlayers = {
      ...game.players,
      player2: {
        name: username || "Player 2",
        color: "yellow",
      },
    };

    const updates = {
      [`games/${joinUuid}/players`]: updatedPlayers,
      [`games/${joinUuid}/global/hastwoplayers`]: true,
    };

    await update(ref(database), updates);
  };

  const handleDrop = async (position, colIndex) => {
    if (!uuid || !playerId || isDropping) return; // Prevent multiple coins
    setIsDropping(true); // Lock dropping

    const newCoin = {
      id: crypto.randomUUID(),
      position,
      playerId,
      color: gameData.players[playerId].color,
    };

    const updatedCoins = [...coins, newCoin];

    await update(ref(database, `games/${uuid}`), {
      coins: updatedCoins,
    });
    setTimeout(() => {
      setIsDropping(false);
    }, 1000);
  };
  useEffect(() => {
    if (!uuid) return;

    const hoverRef = ref(database, `games/${uuid}/hoveredColumn`);
    const unsubscribe = onValue(hoverRef, (snapshot) => {
      if (snapshot.exists() && snapshot.val().playerId !== playerId) {
        setOpponentHoverColumn(snapshot.val().colIndex);
      }
    });

    return () => unsubscribe();
  }, [uuid]);

  useEffect(() => {
    if (!uuid) return;

    const gameRef = ref(database, `games/${uuid}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const newData = snapshot.val();
        setGameData(newData);
        setCoins(newData.coins || []);
      }
    });

    return () => unsubscribe();
  }, [uuid]);

  return (
    <div style={{ width: "100%", height: "97.7%" }}>
      <div
        className={styles.boardInner}
        style={{ textAlign: "center", marginBottom: "10px" }}
      >
        {uuid ? (
          <>
            <div className={styles.informationsBoard}>
              <h2>Game ID: {uuid}</h2>
              <h3>Vous êtes {gameData?.players?.[playerId]?.name}</h3>
              <button onClick={beginGame}>Nouvelle partie</button>
            </div>
            <Canvas shadows camera={{ position: [0, 8, 15], fov: 100 }}>
              <primitive object={cubeTexture} attach="background" />
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[5, 10, 7]}
                intensity={1}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />

              <OrbitControls />

              {opponentHoverColumn !== null && (
                <CoinHover
                  key={opponentHoverColumn}
                  hoverColumn={opponentHoverColumn}
                  color="gray"
                />
              )}
              <Physics gravity={[0, -9.81, 0]}>
                <Plane />
                <GameBoard />
                <BoardPhysicsStructure />
                {coins.map((coin) => (
                  <Coin
                    key={coin.id}
                    position={coin.position}
                    color={coin.color}
                  />
                ))}{" "}
              </Physics>
              <ClickToDrop
                onDrop={handleDrop}
                boardPosition={[0, 4, 0]}
                columns={7}
                slotRadius={0.5}
                slotPadding={0.25}
                uuid={uuid}
                playerId={playerId}
              />
            </Canvas>
          </>
        ) : (
          <div className={styles.boardBegin}>
            <img src="/img/connectfour/logo.png" alt="" />
            <div>
              <p>Votre pseudo :</p>
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <hr />
            <div className={styles.boardButtons}>
              <button onClick={createGame}>Créer une partie</button>
              <p style={{ textAlign: "center", margin: "10px 0" }}>OU</p>
              <div className="boardButtonsLogin">
                <input
                  type="text"
                  placeholder="Enter game ID"
                  value={joinUuid}
                  onChange={(e) => setJoinUuid(e.target.value)}
                />
                <button onClick={joinGame}>Join Game</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
