"use client";
import { useState, useEffect } from "react";
import { ref, set, update, get, onValue } from "firebase/database";
import { database } from "../../../../firebase";
import { httpCard } from "../../../../axios/http";
import styles from "./gamescreen.module.scss";
import GameBoard from "./gameboard";
import Hand from "./hand";
import HandOpponent from "./handopponent";

export function DealCards({
  uuid,
  playerId,
  setHand,
}: {
  uuid: string;
  playerId: string;
  setHand: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    const dealCards = async () => {
      const gameRef = ref(database, `games/${uuid}`);
      const snapshot = await get(gameRef);
      if (!snapshot.exists()) return;
      const gameData = snapshot.val();

      const playerDeck = gameData.players[playerId]?.cards;
      if (!playerDeck) return; // Ensure deck exists

      const playerHand = playerDeck.slice(0, 7);
      const remainingPlayerCards = playerDeck.slice(7);

      const updates = {
        [`games/${uuid}/players/${playerId}/hand`]: playerHand,
        [`games/${uuid}/players/${playerId}/cards`]: remainingPlayerCards,
      };

      await update(ref(database), updates);

      // Update Firebase with the player's hand and remaining cards

      // Set the hand to be visible
      setHand(true);
    };

    dealCards();
  }, [uuid, playerId, setHand]);

  return null; // No JSX, since it only handles the side effect
}
export function DealCardsOpponent({
  uuid,
  playerId,
  setHandOpponent,
}: {
  uuid: string;
  playerId: string;
  setHandOpponent: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    const dealCardsOpponent = async () => {
      const gameRef = ref(database, `games/${uuid}`);
      const snapshot = await get(gameRef);

      if (!snapshot.exists()) return; // Exit if no data exists

      const gameData = snapshot.val();
      const opponentId = Object.keys(gameData.players).find(
        (id) => id !== playerId
      );

      if (!opponentId) return; // Ensure there is an opponent

      const playerOpponentHand = gameData.players[opponentId]?.hand;

      if (!playerOpponentHand) return; // Ensure hand exists for the opponent

      // Only set the hand opponent to true when everything is fetched correctly
      setHandOpponent(true);
    };

    dealCardsOpponent();
  }, [uuid, playerId, setHandOpponent]);

  return null;
}

const GameScreen = ({ uuid, playerId }) => {
  const [gameData, setGameData] = useState(null);
  const [setHand, setSetHand] = useState(false);
  const [setHandOpponent, setSetHandOpponent] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{
    card: string;
    index: number;
  } | null>(null);
  const [selectedCardOrigin, setSelectedCardOrigin] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

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

  useEffect(() => {
    if (gameData && gameData.players && playerId) {
      // Only deal cards when the game data is ready
      if (!gameData.players[playerId]?.hand?.length) {
        setSetHand(false); // Reset before dealing
      }
    }
  }, [gameData, playerId]);

  if (!gameData) return <div>Loading game...</div>;

  const opponentId = Object.keys(gameData.players).find(
    (id) => id !== playerId
  );
  if (!opponentId) return <div>Waiting for an opponent...</div>;

  const playerHand = gameData.players[playerId]?.hand || [];

  const handleCardPlacement = (targetSlotIndex) => {
    if (!selectedCard || selectedCardOrigin === null) return;

    const updates = {};
    const boardPath = (slot) =>
      `games/${uuid}/players/${playerId}/board/${slot}/cards`;
    const playerPath = `games/${uuid}/players/${playerId}`;
    const board = gameData.players[playerId].board;
    const hand = gameData.players[playerId].hand;
    const deck = gameData.players[playerId].cards;
    const targetSlot = board[targetSlotIndex];

    // ✅ Normalize target cards
    const targetCards = Array.isArray(targetSlot.cards)
      ? targetSlot.cards
      : targetSlot.cards
      ? [targetSlot.cards]
      : [];

    // ❌ 1. Prevent duplicates in multiple
    if (
      targetSlot.multiple &&
      targetCards.some((c, i) => {
        const cardName = typeof c === "string" ? c : c.card;
        const isSameName = cardName === selectedCard.card;
        const isSameInstance =
          selectedCardOrigin === targetSlotIndex && i === selectedCard.index;

        return isSameName && isSameInstance;
      })
    ) {
      console.warn(
        "This exact card is already in this slot — skipping placement."
      );
      return;
    }

    // ❌ 2. Prevent overwrite in non-multiple
    if (
      !targetSlot.multiple &&
      targetSlot.cards &&
      (typeof targetSlot.cards === "string"
        ? true
        : targetSlot.cards.card !== undefined)
    ) {
      console.warn("Cannot place card: slot already occupied.");
      return;
    }

    // ✅ 3. Remove from origin
    if (selectedCardOrigin === "hand") {
      const updatedHand = [...hand];
      updatedHand.splice(selectedCard.index, 1);
      updates[`${playerPath}/hand`] = updatedHand;
    } else {
      const originSlot = board[selectedCardOrigin];
      const originCards = Array.isArray(originSlot.cards)
        ? originSlot.cards
        : originSlot.cards
        ? [originSlot.cards]
        : [];

      const newOriginCards = originCards.filter((c, i) =>
        typeof c === "string"
          ? i !== selectedCard.index
          : i !== selectedCard.index
      );

      updates[boardPath(selectedCardOrigin)] = originSlot.multiple
        ? newOriginCards
        : newOriginCards[0] || "";
    }

    // ✅ 4. Add to deck or target slot
    if (targetSlot.name === "deck") {
      const currentDeck = Object.values(deck || {}).filter(
        (val) => typeof val === "string"
      );
      const updatedDeck = [...currentDeck, selectedCard];
      updates[`${playerPath}/cards`] = updatedDeck;
    } else {
      const newCardObj = { card: selectedCard.card, revealed: false };

      if (targetSlot.multiple) {
        // Ensure existing cards are array (even if empty or malformed)
        const targetCardList = Array.isArray(targetSlot.cards)
          ? targetSlot.cards
          : targetSlot.cards
          ? [targetSlot.cards]
          : [];

        updates[boardPath(targetSlotIndex)] = [...targetCardList, newCardObj];
      } else {
        updates[boardPath(targetSlotIndex)] = newCardObj;
      }
    }

    // ✅ 5. Push update
    update(ref(database), updates)
      .then(() => {
        setSelectedCard(null);
        setSelectedCardOrigin(null);
      })
      .catch((err) => console.error("Error moving card:", err));
  };

  const handleCardSelect = (card: string, index: number, origin: string) => {
    if (card && index !== -1 && origin) {
      setSelectedCard({ card, index });
      setSelectedCardOrigin(origin);
    } else {
      setSelectedCard(null);
      setSelectedCardOrigin(null);
    }
  };

  const handleShuffleDeck = () => {
    const rawDeck = gameData.players[playerId]?.cards || {};
    const deck = Object.values(rawDeck).filter(
      (val) => typeof val === "string"
    );

    const shuffled = [...deck].sort(() => Math.random() - 0.5);

    const deckPath = `games/${uuid}/players/${playerId}/cards`;

    update(ref(database), {
      [deckPath]: shuffled,
    });
  };

  const handleDrawCard = () => {
    const player = gameData.players[playerId];

    // Convert deck object to array
    const rawDeck = player.cards || {};
    const deck = Object.values(rawDeck).filter(
      (val) => typeof val === "string"
    );
    const hand = Array.isArray(player.hand) ? player.hand : [];

    if (deck.length === 0) return;

    const drawnCard = deck[0];
    const newDeck = deck.slice(1);
    const newHand = [...hand, drawnCard];

    const deckPath = `games/${uuid}/players/${playerId}/cards`;
    const handPath = `games/${uuid}/players/${playerId}/hand`;

    update(ref(database), {
      [deckPath]: newDeck,
      [handPath]: newHand,
    });
  };

  const handleRevealCard = (card, slotIndex) => {
    const boardPath = `games/${uuid}/players/${playerId}/board/${slotIndex}/cards`;

    const currentSlot = gameData.players[playerId].board[slotIndex];
    const updatedCards = Array.isArray(currentSlot.cards)
      ? currentSlot.cards.map((c) =>
          typeof c === "string"
            ? c
            : c.card === card
            ? { ...c, revealed: true }
            : c
        )
      : { ...currentSlot.cards, revealed: true };

    update(ref(database), {
      [boardPath]: updatedCards,
    });
  };
  const handleCardHover = (cardInfo) => {
    console.log(cardInfo);
    setHoveredCard(cardInfo);
  };

  return (
    <>
      <div className={styles.gameScreenGlobal}>
        {playerHand.length > 0 && (
          <Hand
            cards={playerHand}
            selectedCard={selectedCard}
            onCardSelect={(card, index, origin) =>
              card && index !== -1 && origin
                ? (setSelectedCard({ card, index }),
                  setSelectedCardOrigin(origin))
                : (setSelectedCard(null), setSelectedCardOrigin(null))
            }
            onCardHover={handleCardHover}
          />
        )}{" "}
        <DealCards uuid={uuid} playerId={playerId} setHand={setSetHand} />
        <DealCardsOpponent
          uuid={uuid}
          playerId={playerId}
          setHandOpponent={setSetHandOpponent}
        />
        {hoveredCard && (
          <div className={styles.cardPreview}>
            <img
              src={
                hoveredCard.revealed
                  ? `https://portfolio-maxime-back.maxime-eloir.fr/wp-content/uploads/card/${
                      hoveredCard.card.split("-")[0]
                    }/${hoveredCard.card}.png`
                  : "/img/cardgame/pocket/back.png"
              }
              alt="Preview"
            />
          </div>
        )}
        <div className={styles.gamescreen}>
          {/* Opponent's Board (Mirrored) */}
          <GameBoard
            board={gameData.players[opponentId]?.board || []}
            mirrored={true}
            selectedCard={selectedCard} // Pass selected card to GameBoard
            onCardHover={handleCardHover}
          />
          {/* Player's Board */}
          <div className={styles.pokeball}>
            <div className={styles.topPart}></div>
            <div className={styles.bottomPart}></div>
            <div className={styles.middlePart}></div>
            <div className={styles.middleCircle}></div>
            <button className={styles.pokeballButton}></button>
          </div>
          <GameBoard
            board={gameData.players[playerId]?.board || []}
            mirrored={false}
            selectedCard={selectedCard}
            onCardPlaced={handleCardPlacement}
            onDraw={handleDrawCard}
            onShuffle={handleShuffleDeck}
            cardSelection={handleCardSelect}
            onReveal={handleRevealCard}
            selectedCardOrigin={selectedCardOrigin}
            onCardHover={handleCardHover}
          />
          {setHandOpponent && <HandOpponent />}
          {/* Show Hand only when cards are dealt */}
        </div>
      </div>
    </>
  );
};

export default GameScreen;
