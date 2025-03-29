import CardSlot from "./cardslot";
import styles from "./gameboard.module.scss";
const GameBoard = ({
  board,
  mirrored,
  selectedCard,
  onCardPlaced,
  onDraw,
  onShuffle,
  cardSelection,
  onReveal,
  selectedCardOrigin,
  onCardHover
}) => {
  return (
    <div className={`${styles.gameboard} ${mirrored ? styles.rotate : ""}`}>
      {board.map((cell, index) => (
        <CardSlot
          key={index}
          {...cell}
          onClick={() => onCardPlaced && onCardPlaced(index)}
          isInteractive={!!onCardPlaced && cell.can}
          selectedCard={selectedCard}
          onCardSelect={(card, cardIndex, index) =>
            cardSelection(card, cardIndex, index) // 👈 also pass slotIndex as "origin"
          }
          slotIndex={index} // ✅ pass the index as a prop
          onDraw={index === 6 ? onDraw : null}
          onShuffle={index === 6 ? onShuffle : null}
          onRevealCard={onReveal}  
          selectedCardOrigin={selectedCardOrigin}
          onHover={onCardHover}


        />
      ))}
    </div>
  );
};

export default GameBoard;
