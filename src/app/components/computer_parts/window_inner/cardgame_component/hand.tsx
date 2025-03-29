// components/Hand.tsx
import React from "react";
import styles from "./hand.module.scss";

interface HandProps {
  cards: string[];
  selectedCard: { card: string; index: number } | null;
  onCardSelect: (card: string, index: number, origin: string) => void;
  onCardHover: (cardInfo: { card: string; revealed: boolean } | null) => void;
}

const Hand: React.FC<HandProps> = ({
  cards,
  selectedCard,
  onCardSelect,
  onCardHover,
}) => {
  const handleCardClick = (
    e: React.MouseEvent<HTMLDivElement>,
    card: string,
    index: number
  ) => {
    e.stopPropagation();
    const isAlreadySelected =
      selectedCard?.card === card && selectedCard?.index === index;

    if (isAlreadySelected) {
      onCardSelect("", -1, "hand"); // 👈 Deselect
    } else {
      onCardSelect(card, index, "hand"); // 👈 Select with origin
    }
  };

  return (
    <div className={styles.hand}>
      <div className={styles.handInner}>
        {cards.length > 0 &&
          cards.map((card, index) => {
            const cardBase = card.split("-")[0];
            const rotationDegree = 15 * (index - Math.floor(cards.length / 2));
            const overlapAmount = 20;

            const isSelected =
              selectedCard?.card === card && selectedCard?.index === index;

            return (
              <div
                data-pokemon={card}
                key={`${card}-${index}`} // ✅ Make key unique
                className={`${styles.card} ${isSelected ? styles.active : ""}`}
                onMouseEnter={() => onCardHover({ card, revealed: true })}
                onMouseLeave={() => onCardHover(null)}
                onClick={(e) => handleCardClick(e, card, index)}
                style={{
                  // transform: `rotate(${rotationDegree}deg)`, // Uncomment if needed
                  marginLeft: index === 0 ? 0 : -overlapAmount,
                  marginRight: index === cards.length - 1 ? 0 : -overlapAmount,
                }}
              >
                <img
                  src={`https://portfolio-maxime-back.maxime-eloir.fr/wp-content/uploads/card/${cardBase}/${card}-small.png`}
                  alt={`Card ${cardBase}`}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Hand;
