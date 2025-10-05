import React, { useEffect, useState } from 'react';

const Player = ({ width, height }) => {
  const PLAYER_SIZE = 30;
  const SPEED = 4;
  const FRICTION = 0.9;

  const [position, setPosition] = useState({
    x: width / 2 - PLAYER_SIZE / 2,
    y: height - 100,
  });

  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [keysPressed, setKeysPressed] = useState({});

  useEffect(() => {
    const keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      w: false,
      a: false,
      s: false,
      d: false,
    };

    const handleKeyDown = (e) => {
      if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
        setKeysPressed({ ...keys });
      }
    };

    const handleKeyUp = (e) => {
      if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
        setKeysPressed({ ...keys });
      }
    };

    const move = () => {
      let dx = 0;
      let dy = 0;

      if (keysPressed.w || keysPressed.ArrowUp) dy -= SPEED;
      if (keysPressed.s || keysPressed.ArrowDown) dy += SPEED;
      if (keysPressed.a || keysPressed.ArrowLeft) dx -= SPEED;
      if (keysPressed.d || keysPressed.ArrowRight) dx += SPEED;

      if (dx !== 0 || dy !== 0) {
        setVelocity({ x: dx, y: dy });
        setPosition((prev) => ({
          x: Math.max(0, Math.min(prev.x + dx, width - PLAYER_SIZE)),
          y: Math.max(0, Math.min(prev.y + dy, height - PLAYER_SIZE)),
        }));
      } else {
        // Apply momentum only when not pressing keys
        setVelocity((prevVel) => {
          const newVx = prevVel.x * FRICTION;
          const newVy = prevVel.y * FRICTION;

          setPosition((prevPos) => ({
            x: Math.max(0, Math.min(prevPos.x + newVx, width - PLAYER_SIZE)),
            y: Math.max(0, Math.min(prevPos.y + newVy, height - PLAYER_SIZE)),
          }));

          return { x: newVx, y: newVy };
        });
      }
    };

    const interval = setInterval(move, 16); // 60 FPS

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keysPressed, width, height]);

  return (
    <div
      style={{
        position: 'absolute',
        width: `${PLAYER_SIZE}px`,
        height: `${PLAYER_SIZE}px`,
        borderRadius: '50%',
        backgroundColor: '#2196F3',
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    />
  );
};

export default Player;
