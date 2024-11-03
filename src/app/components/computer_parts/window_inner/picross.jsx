import { useEffect, useState } from "react";
import styles from "./picross.module.scss";

export function PicrossWindow() {
  const gridSize = 10;
  const imageArray = [
    0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0,
    1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
  ];

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

  const [tiles, setTiles] = useState(Array(gridSize * gridSize).fill(null));

  const toggleTileState = (index) => {
    setTiles((prevTiles) => {
      const newTiles = [...prevTiles];
      if (newTiles[index] === "filled") {
        newTiles[index] = "marked";
      } else if (newTiles[index] === "marked") {
        newTiles[index] = null;
      } else {
        newTiles[index] = "filled";
      }
      return newTiles;
    });
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
  const renderGrid = () => (
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
      <div className={styles.grid}>
        {tiles.map((tileState, index) => (
          <div
            key={index}
            className={`${styles.tile} ${
              tileState === "filled" ? styles.filled : ""
            } ${tileState === "marked" ? styles.marked : ""}`}
            onClick={() => toggleTileState(index)}
          ></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.gameContainer}>
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

      {renderGrid()}
    </div>
  );
}
