// components/Hand.tsx
import React from "react";
import styles from "./handopponent.module.scss"; // You can add styles for the hand here
import { useState } from "react";

const HandOpponent = () => {
  return (
    <div className={styles.handOpponent}>
      <div className={styles.handInner}>
        {Array.from({ length: 7 }).map((_, index) => {
          const rotationDegree = 15 * (index - Math.floor(5 / 2)); // Calculate rotation based on card position (fixed to 5 cards)
          const overlapAmount = 20; // Amount of overlap between cards
          return (
            <div
              key={index}
              className={styles.card}
              style={{
                // transform: `rotate(${rotationDegree}deg)`, // Apply rotation if needed
                marginLeft: index === 0 ? 0 : -overlapAmount, // Make cards overlap
                marginRight: index === 4 ? 0 : -overlapAmount, // Make cards overlap (fixed for 5 cards)
              }}
            >
              <img
                src={`https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg`}
                alt={`Card Opponent`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HandOpponent;
