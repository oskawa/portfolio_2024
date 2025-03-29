import { useState, useEffect, useRef } from "react";
import { httpCard } from "../../../../axios/http";
import styles from "./deck.module.scss";
import { TcgCard } from "./tcgCard";

type Deck = {
  username: string;
  game: string;
  name: string;
  cards: {
    [cardId: string]: number;
  };
};
type CardItem = {
  id: string;
  image: string;
  image_thumbnail: string;
  name: string;
  // Add other properties as needed
};
type CardSet = {
  id: string;
  name: string;
  details?: {
    cards: CardItem[];
  };
};

export function Decks({ game, username }: { game: string; username: string }) {
  const [userDecks, setUserDecks] = useState([]);
  const [cards, setCards] = useState<CardSet[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [newDeckName, setNewDeckName] = useState("");
  const [expandedSet, setExpandedSet] = useState<string | null>(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [selectedCards, setSelectedCards] = useState<{
    [cardId: string]: number;
  }>({});
  const [popup, setPopup] = useState(false);
  const [cardId, setCardId] = useState("");
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log(popup);

      setPopup(false); // Close popup if clicked outside
    };

    if (popup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popup]);

  useEffect(() => {
    console.log("Popup state changed:", popup);
  }, [popup]);

  useEffect(() => {
    if (currentDeck?.cards) {
      setSelectedCards(currentDeck.cards);
    }
  }, [currentDeck]);

  const updateCardQuantity = (cardId: string, quantity: number) => {
    setSelectedCards((prev) => {
      if (quantity <= 0) {
        const { [cardId]: _, ...rest } = prev;
        return rest; // remove card if quantity is 0
      }
      return { ...prev, [cardId]: quantity };
    });
  };

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards((prev) => {
      const quantity = prev[cardId] || 0;
      if (quantity > 0) {
        return prev; // already selected, do nothing
      }
      return { ...prev, [cardId]: 1 }; // add with quantity 1
    });
  };

  const toggleAccordion = (setId: string) => {
    setExpandedSet(expandedSet === setId ? null : setId);
  };

  async function getUserDecks() {
    try {
      const response = await httpCard.get("userdeck", {
        params: { game, username },
      });

      setUserDecks(response.data || []);
    } catch (error) {
      console.error("Error fetching user decks:", error);
    }
  }

  async function createDeck() {
    try {
      setIsCreatingDeck(true);
      await httpCard.post("save_decks", {
        username,
        game,
        deck_name: newDeckName,
        cards: [],
      });
      getUserDecks();
      setNewDeckName("");
      setIsCreatingDeck(false);
    } catch (error) {
      console.error("Error creating new deck:", error);
      setIsCreatingDeck(false);
    }
  }

  const selectDeck = async (deck: Deck) => {
    setCurrentDeck(deck);
    setSelectedCards(deck.cards);
    try {
      const additionalResponse = await httpCard.get("tcg-pocket");
      setCards(additionalResponse.data);
    } catch (error) {
      console.error("Error fetching card details:", error);
    }
  };

  const highCard = (e: React.MouseEvent<HTMLLabelElement>, image: string) => {
    e.preventDefault();

    setPopup(true);
    setCardId(image);
  };

  const removeDeck = async () => {
    if (!currentDeck) {
      return;
    }
    try {
      await httpCard.post("remove_decks", {
        username,
        game,
        deck_name: currentDeck.name,
      });
      alert("Deck updated successfully!");
    } catch (error) {
      console.error("Error saving deck:", error);
      alert("Failed to update deck.");
    }
  };
  const saveDeck = async () => {
    if (!currentDeck) {
      alert("Please select a deck first.");
      return;
    }
    try {
      await httpCard.post("save_decks", {
        username,
        game,
        deck_name: currentDeck.name,
        cards: selectedCards,
      });
      alert("Deck updated successfully!");
    } catch (error) {
      console.error("Error saving deck:", error);
      alert("Failed to update deck.");
    }
  };

  useEffect(() => {
    getUserDecks();
  }, [game, username]);

  return (
    <>
      <div className={styles.deckInner}>
        {userDecks.length > 0 ? (
          <div>
            <h3>Vos decks :</h3>
            <ul className={styles.deckList}>
              {userDecks.map((deck: Deck, index) => (
                <li key={index}>
                  <button
                    className={deck === currentDeck ? styles.active : ""}
                    onClick={() => selectDeck(deck)}
                  >
                    {deck.name || "Unnamed Deck"}{" "}
                  </button>
                </li>
              ))}
            </ul>

            {currentDeck && (
              <div>
                <h3>Liste des cartes disponibles : </h3>
                {cards.length > 0 ? (
                  cards.map((cardSet, setIndex) => (
                    <div key={setIndex}>
                      <h4 onClick={() => toggleAccordion(cardSet.id)}>
                        {cardSet.name} {expandedSet === cardSet.id ? "▼" : "▶"}
                      </h4>
                      {expandedSet === cardSet.id && (
                        <div>
                          <ul className={styles.cardList}>
                            {cardSet.details?.cards?.map(
                              (cardItem, cardIndex) => {
                                const quantity =
                                  selectedCards[cardItem.id] || 0;

                                return (
                                  <li
                                    key={cardIndex}
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      margin: "10px",
                                    }}
                                  >
                                    <div
                                      onClick={() =>
                                        toggleCardSelection(cardItem.id)
                                      }
                                      onContextMenu={(e) =>
                                        highCard(e, cardItem.image)
                                      }
                                      className={
                                        quantity > 0 ? styles.checked : ""
                                      }
                                      
                                    >
                                      <img
                                        src={cardItem.image_thumbnail}
                                        alt={cardItem.name}
                                        style={{
                                          width: "100px",
                                          height: "auto",
                                        }}
                                      />
                                    </div>

                                    {quantity > 0 && (
                                      <div className={styles.quantityManage}
                                        style={{
                                          marginTop: "8px",
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <button
                                          onClick={() =>
                                            updateCardQuantity(
                                              cardItem.id,
                                              quantity - 1
                                            )
                                          }
                                        >
                                          -
                                        </button>
                                        <span style={{ margin: "0 8px" }}>
                                          {quantity}
                                        </span>
                                        <button
                                          onClick={() =>
                                            updateCardQuantity(
                                              cardItem.id,
                                              quantity + 1
                                            )
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    )}
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No card sets available.</p>
                )}
                <div className={styles.buttonList}>
                  <button
                    onClick={saveDeck}
                    style={{ marginTop: "20px", padding: "10px" }}
                  >
                    Sauvegarder le deck
                  </button>
                  <button
                    className={styles.removeDeck}
                    onClick={removeDeck}
                    style={{ marginTop: "20px", padding: "10px" }}
                  >
                    Supprimer le deck
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3>No decks found for {game}</h3>
            <input
              type="text"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              placeholder="Enter deck name"
            />
            <button onClick={createDeck} disabled={isCreatingDeck}>
              {isCreatingDeck ? "Creating..." : "Create New Deck"}
            </button>
          </div>
        )}
      </div>
      {popup && (
        <div className={styles.popup} ref={popupRef}>
          {cardId && <TcgCard cardUrl={cardId} />}
        </div>
      )}
    </>
  );
}
