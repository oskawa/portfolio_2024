import styles from "./cardslot.module.scss";

const CardSlot = ({
  cards,
  can,
  name,
  onClick,
  isInteractive,
  selectedCard,
  onDraw,
  onShuffle,
  slotIndex,
  onCardSelect,
  onRevealCard,
  selectedCardOrigin,
  onHover,
}) => {
  const isDeck = name === "deck";
  const slotClassName = name ? name.replace(/\s+/g, "_") : ""; // replace spaces just in case

  const handleSlotClick = () => {
    if (can && onClick) {
      onClick();
    }
  };

  const handleCardClick = (e, card, index) => {
    e.stopPropagation();

    console.log(selectedCard);
    console.log(selectedCardOrigin);
    console.log(slotIndex);
    const isSameCard =
      selectedCard?.card === card &&
      selectedCard?.index === index &&
      selectedCardOrigin === slotIndex;
     

    if (!selectedCard || isSameCard) {
      if (isSameCard) {
        onCardSelect(null, null, null); // Unselect
      } else {
        onCardSelect(card, index, slotIndex); // Select
      }
    }

    // 👉 If a card is already selected and you're clicking something else (like this slot),
    // don't treat it as a selection — let it bubble up to `handleSlotClick`
  };

  const renderCard = (cardData, index) => {
    const card = typeof cardData === "string" ? cardData : cardData.card;
    const revealed = typeof cardData === "string" ? true : cardData.revealed;
    const isSelected =
      selectedCard?.card === card &&
      selectedCard?.index === index &&
      selectedCardOrigin === slotIndex;
    const cardBase = card.split("-")[0];

    const handleRightClick = (e) => {
      e.preventDefault(); // Disable context menu
      if (!revealed && onRevealCard) {
        onRevealCard(card, slotIndex);
      }
    };

    return (
      <img
        className={isSelected ? styles.selected : ""}
        key={`${card}-${index}`}
        src={
          revealed
            ? `https://portfolio-maxime-back.maxime-eloir.fr/wp-content/uploads/card/${cardBase}/${card}-small.png`
            : "/img/cardgame/pocket/back-card.png" // 👈 your hidden image
        }
        alt={card}
        onClick={(e) => handleCardClick(e, card, index)}
        onContextMenu={handleRightClick} // 👈 right-click to reveal
        onMouseEnter={() => onHover({ card: card, revealed })}
        onMouseLeave={() => onHover(null)}
      />
    );
  };

  return (
    <div
      className={`${styles.cardslot} ${!can ? styles.empty : ""} ${
        styles[slotClassName] || ""
      } ${isInteractive ? styles.interactive : ""}`}
      onClick={handleSlotClick}
    >
      {isDeck ? (
        <>
          <img
            src="./img/cardgame/pocket/deck.png"
            alt="Deck"
            style={{ width: "100%", height: "auto" }}
          />
          <div className={styles.deckButtons}>
            <button onClick={onShuffle} title="Shuffle">
              🔀
            </button>
            <button onClick={onDraw} title="Draw">
              🎴
            </button>
          </div>
        </>
      ) : Array.isArray(cards) ? (
        cards.map((c, i) => renderCard(c, i))
      ) : (
        cards && renderCard(cards, 0)
      )}
    </div>
  );
};

export default CardSlot;
