import { useState, useEffect, useRef } from "react";
import { httpCard } from "../../../../axios/http";
import styles from "./deck.module.scss";
import { TcgCard } from "./tcgCard";

type Deck = {
  username: string;
  game: string;
  name: string;
  cards: []; // Adjust the type based on what `cards` actually contains
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
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
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

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards((prevSelected: any) =>
      prevSelected.includes(cardId)
        ? prevSelected.filter((id: string) => id !== cardId)
        : [...prevSelected, cardId]
    );
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
                              (cardItem, cardIndex) => (
                                <li
                                  key={cardIndex}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <label
                                    onContextMenu={(e) =>
                                      highCard(e, cardItem.image)
                                    }
                                    className={`${
                                      selectedCards.includes(cardItem.id)
                                        ? styles.checked
                                        : ""
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedCards.includes(
                                        cardItem.id
                                      )}
                                      onChange={() =>
                                        toggleCardSelection(cardItem.id)
                                      }
                                    />
                                    <img
                                      src={cardItem.image_thumbnail}
                                      alt={cardItem.name}
                                      style={{ width: "100px", height: "auto" }}
                                    />
                                  </label>
                                </li>
                              )
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
