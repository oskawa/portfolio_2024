import React, { useEffect, useRef, useState } from "react";

const Ball = ({ width, height }) => {
  const BALL_SIZE = 20;

  const ballRef = useRef(null);
  const [position, setPosition] = useState({
    x: width / 2 - BALL_SIZE / 2,
    y: height / 2 - BALL_SIZE / 2,
  });
  const [velocity, setVelocity] = useState({ x: 2, y: 1 });

  const FRICTION = 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVx = velocity.x * FRICTION;
        let newVy = velocity.y * FRICTION;

        // Bounce on walls
        if (newX <= 0 || newX + BALL_SIZE >= width) {
          newVx = -newVx;
        }
        if (newY <= 0 || newY + BALL_SIZE >= height) {
          newVy = -newVy;
        }

        setVelocity({ x: newVx, y: newVy });

        return {
          x: Math.min(Math.max(0, newX), width - BALL_SIZE),
          y: Math.min(Math.max(0, newY), height - BALL_SIZE),
        };
      });
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [velocity, width, height]);

  return (
    <div
      ref={ballRef}
      style={{
        position: "absolute",
        width: `${BALL_SIZE}px`,
        height: `${BALL_SIZE}px`,
        borderRadius: "50%",
        backgroundColor: "white",
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    />
  );
};

export default Ball;
