import { useEffect, useState } from "react";
import styles from "./picross.module.scss";

export function PicrossWindow() {
  const [gridSize, setGridSize] = useState(10);
  const [gridStyle, setGridStyle] = useState(null);
  const [triggerButton, setTriggerButton] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(false);
  const [tiles, setTiles] = useState(Array(gridSize * gridSize).fill(null));
  const [imageArray, setImageArray] = useState([
    0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0,
    1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
  ]);

  const puzzles = [
    {
      name: "Puzzle 1",
      size: 10,
      array: [
        0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0,
        0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1,
        1, 1, 1, 0,
      ],
      // Add more 10x10 puzzles here
    },
    {
      name: "Puzzle 2",
      size: 10,
      array: [
        1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0,
        1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1,
        1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0,
        0, 0, 0, 1,
      ],
    },
    {
      name: "Puzzle 3",
      size: 15,
      array: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1,
        1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0,
        1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1,
        1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1,
        1, 1, 1, 0, 1, 1, 1, 1, 1,
      ],
    },

    // Add more grid sizes and puzzles as needed
  ];

  const handleGridSizeChange = (index) => {
    setGridSize(puzzles[index]["size"]);
    setImageArray(puzzles[index]["array"]); // Default to the first puzzle for the chosen size
    setTriggerButton(true);
    setTiles(Array(puzzles[index]["size"] * puzzles[index]["size"]).fill(null));
    setGridStyle({
      display: "grid",
      gridTemplateColumns: `repeat(${puzzles[index]["size"]}, 20px)`,
      gridTemplateRows: `repeat(${puzzles[index]["size"]}, 20px)`,
    });
  };

  const handleReturn = () => {
    setTriggerButton(false);
  };

  const convertTo2DArray = (flatArray, size) => {
    const twoDArray = [];
    for (let i = 0; i < size; i++) {
      twoDArray.push(flatArray.slice(i * size, (i + 1) * size));
    }
    return twoDArray;
  };

  const generateClues = (line) => {
    const clues = [];
    let count = 0;

    line.forEach((cell) => {
      if (cell === 1) {
        count++;
      } else {
        if (count > 0) {
          clues.push(count);
          count = 0;
        }
      }
    });

    if (count > 0) clues.push(count);
    return clues.length > 0 ? clues : [0];
  };

  const grid = convertTo2DArray(imageArray, gridSize);
  const rowClues = grid.map((row) => generateClues(row));
  const transposedGrid = grid[0].map((_, colIndex) =>
    grid.map((row) => row[colIndex])
  );
  const columnClues = transposedGrid.map((col) => generateClues(col));
  const handleContextMenu = (event, index) => {
    // Prevent the default context menu (right-click menu)
    event.preventDefault();
    toggleTileState(event, index);
    console.log("Right click detected, context menu prevented");
  };
  const toggleTileState = (event, index, click = false) => {
    if (event.button === 2) {
      setTiles((prevTiles) => {
        const newTiles = [...prevTiles];
        if (newTiles[index] === "marked") {
          newTiles[index] = null;
        } else if (newTiles[index] === "filled") {
          newTiles[index] = "marked";
        } else if (newTiles[index] === null) {
          newTiles[index] = "marked";
        }
        return newTiles;
      });
    } else if (hoveredIndex || click) {
      setTiles((prevTiles) => {
        const newTiles = [...prevTiles];
        if (newTiles[index] === "filled") {
          newTiles[index] = null;
        } else if (newTiles[index] === null) {
          newTiles[index] = "filled";
        }else if (newTiles[index] === "marked") {
          newTiles[index] = "filled";
        }
        return newTiles;
      });
    }
  };
  const handleMouseEnter = () => {
    setHoveredIndex(true);
  };

  // Reset the hovered index when the mouse leaves
  const handleMouseLeave = () => {
    setHoveredIndex(false);
  };

  const checkSolution = () => {
    const correct = tiles.every((tile, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      const shouldBeFilled = grid[row][col] === 1;
      return (tile === "filled") === shouldBeFilled;
    });

    if (correct) {
      alert("Congratulations! You've solved the puzzle.");
    } else {
      alert("Some tiles are incorrect. Keep trying!");
    }
  };

  return (
    <>
      {!triggerButton && (
        <div className={styles.title}>
          <div className={styles.title__Inner}>
            <h2>Picross</h2>
            <h3>Sélection du puzzle:</h3>
            <ul className={styles.picrossList}>
              {puzzles.map((puzzle, index) => (
                <li key={index}>
                  <button onClick={() => handleGridSizeChange(index)}>
                    {puzzle.name}
                  </button>
                </li>
              ))}
            </ul>
            <p className={styles.howToPlay}>
              Comment jouer : Le Picross est un jeu de logique où le but est de
              révéler une image cachée en remplissant une grille de cases.
              Chaque ligne et colonne est accompagnée de chiffres indiquant
              combien de cases successives doivent être remplies. En analysant
              ces indices, on déduit quelles cases colorier pour compléter le
              motif. C'est un mélange de déduction et de patience pour obtenir
              une illustration finale.
            </p>
          </div>
        </div>
      )}
      {triggerButton && (
        <>
          <button className={styles.gameReturn} onClick={handleReturn}>
            Retour
          </button>
          <div className={styles.gameContainer}>
            <div>
              <div className={styles.columnClues}>
                {columnClues.map((clue, index) => (
                  <div key={index} className={styles.columnClue}>
                    {clue.map((num, i) => (
                      <div className={styles.clueCell} key={i}>
                        {num}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.gridContainer}>
              <div className={styles.rowClues}>
                {rowClues.map((clue, rowIndex) => (
                  <div key={rowIndex} className={styles.rowClue}>
                    {clue.map((num, clueIndex) => (
                      <div key={clueIndex} className={styles.clueCell}>
                        <span>{num}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={gridStyle}>
                {tiles.map((tileState, index) => (
                  <div
                    key={index}
                    className={`${styles.tile} ${
                      tileState === "filled" ? styles.filled : ""
                    } ${tileState === "marked" ? styles.marked : ""}`}
                    onClick={(event) => toggleTileState(event, index, true)}
                    onContextMenu={(event) => handleContextMenu(event, index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
