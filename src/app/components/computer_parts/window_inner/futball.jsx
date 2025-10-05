import GameBoard from "./futtball/gameboard";
import Ball from "./futtball/ball";
import Player from "./futtball/player";
import React, { useEffect, useRef, useState } from "react";
// import GameBoard from './GameBoard';

export function FutballWindow() {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 800, height: 400 });
  const ASPECT_RATIO = 2;

  // Ball state
  const BALL_SIZE = 20;
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });
  const [ballVel, setBallVel] = useState({ x: 0, y: 0 });

  // Player state
  const PLAYER_SIZE = 30;
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [playerVel, setPlayerVel] = useState({ x: 0, y: 0 });

  const FRICTION = 0.98;
  const PUSH_STRENGTH = 0.3;

  useEffect(() => {
    const resize = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      let width = containerWidth;
      let height = Math.floor(width / ASPECT_RATIO);

      if (height > containerHeight) {
        height = containerHeight;
        width = Math.floor(height * ASPECT_RATIO);
      }

      setSize({ width, height });

      // Init positions
      setBallPos({
        x: width / 2 - BALL_SIZE / 2,
        y: height / 2 - BALL_SIZE / 2,
      });
      setPlayerPos({ x: width / 2 - PLAYER_SIZE / 2, y: height - 100 });
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const keys = {};
    const pressed = new Set();

    const handleKeyDown = (e) => pressed.add(e.key);
    const handleKeyUp = (e) => pressed.delete(e.key);

    const loop = setInterval(() => {
      let dx = 0;
      let dy = 0;
      const SPEED = 4;

      if (pressed.has("ArrowUp") || pressed.has("w")) dy -= SPEED;
      if (pressed.has("ArrowDown") || pressed.has("s")) dy += SPEED;
      if (pressed.has("ArrowLeft") || pressed.has("a")) dx -= SPEED;
      if (pressed.has("ArrowRight") || pressed.has("d")) dx += SPEED;

      const nextPlayer = {
        x: Math.max(0, Math.min(playerPos.x + dx, size.width - PLAYER_SIZE)),
        y: Math.max(0, Math.min(playerPos.y + dy, size.height - PLAYER_SIZE)),
      };

      setPlayerPos(nextPlayer);
      setPlayerVel({ x: dx, y: dy });

      // Collision detection
      const distX =
        nextPlayer.x + PLAYER_SIZE / 2 - (ballPos.x + BALL_SIZE / 2);
      const distY =
        nextPlayer.y + PLAYER_SIZE / 2 - (ballPos.y + BALL_SIZE / 2);
      const distance = Math.sqrt(distX ** 2 + distY ** 2);
      const minDist = PLAYER_SIZE / 2 + BALL_SIZE / 2;

      if (distance < minDist) {
        // Gentle push
        setBallVel({
          x: ballVel.x + playerVel.x * PUSH_STRENGTH,
          y: ballVel.y + playerVel.y * PUSH_STRENGTH,
        });
      }

      // Ball update with friction + bounce
      setBallVel((prevVel) => {
        let newX = prevVel.x * FRICTION;
        let newY = prevVel.y * FRICTION;

        let posX = ballPos.x + newX;
        let posY = ballPos.y + newY;

        if (posX < 0 || posX + BALL_SIZE > size.width) newX = -newX;
        if (posY < 0 || posY + BALL_SIZE > size.height) newY = -newY;

        setBallPos({
          x: Math.max(0, Math.min(posX, size.width - BALL_SIZE)),
          y: Math.max(0, Math.min(posY, size.height - BALL_SIZE)),
        });

        return { x: newX, y: newY };
      });
    }, 16);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      clearInterval(loop);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playerPos, ballPos, size]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <GameBoard width={size.width} height={size.height}>
        {/* Ball visual */}
        <div
          style={{
            position: "absolute",
            width: `${BALL_SIZE}px`,
            height: `${BALL_SIZE}px`,
            borderRadius: "50%",
            backgroundColor: "white",
            top: `${ballPos.y}px`,
            left: `${ballPos.x}px`,
          }}
        />
        {/* Player visual */}
        <div
          style={{
            position: "absolute",
            width: `${PLAYER_SIZE}px`,
            height: `${PLAYER_SIZE}px`,
            borderRadius: "50%",
            backgroundColor: "#2196F3",
            top: `${playerPos.y}px`,
            left: `${playerPos.x}px`,
          }}
        />
      </GameBoard>
    </div>
  );
}
