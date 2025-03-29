import { useState, useEffect } from "react";
import styles from "./minesweeper.module.scss";

const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
};

export function MinesweeperWindow() {
  const BOARD_SIZE = 10;
  const NUMBER_OF_MINES = 10;
  const [board, setBoard] = useState([]);
  const [minesLeft, setMinesLeft] = useState(NUMBER_OF_MINES);
  const [message, setMessage] = useState("");

  // Create board and mines when component mounts
  useEffect(() => {
    const newBoard = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
    setBoard(newBoard);
    setMinesLeft(NUMBER_OF_MINES);
  }, []);

  // Function to handle tile click
  const handleTileClick = (tile) => {
    if (tile.status !== TILE_STATUSES.HIDDEN) return;

    // If the tile is hidden, reveal it
    revealTile(board, tile);
    setBoard([...board]); // Trigger re-render with updated state
    checkGameEnd(board);
  };

  // Function to handle right-click (mark tile)
  const handleTileRightClick = (e, tile) => {
    e.preventDefault();
    markTile(tile);
    setBoard([...board]); // Trigger re-render with updated state
    listMinesLeft();
  };

  // List remaining mines
  function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
      return (
        count +
        row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
      );
    }, 0);
    setMinesLeft(NUMBER_OF_MINES - markedTilesCount);
  }

  // Check if the game has ended (win or lose)
  function checkGameEnd(board) {
    const win = checkWin(board);
    const lose = checkLose(board);

    if (win || lose) {
      setMessage(win ? "Bravo, vous avez gagné !" : "Arf, Essayez encore");
      stopGamePropagation();
    }

    if (lose) {
      board.forEach((row) => {
        row.forEach((tile) => {
          if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
          if (tile.mine) revealTile(board, tile);
        });
      });
    }
  }

  // Stop event propagation to prevent further interactions after game ends
  function stopGamePropagation() {
    // Here you can stop interactions if the game is over
  }

  return (
    <div>
      <div
        className={styles.board}
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
      >
        {board.map((row, rowIndex) =>
          row.map((tile, tileIndex) => (
            <div
              key={`${rowIndex}-${tileIndex}`}
              className={`${styles.tile} ${styles[tile.status]}`}
              onClick={() => handleTileClick(tile)}
              onContextMenu={(e) => handleTileRightClick(e, tile)}
            >
              {tile.status === TILE_STATUSES.NUMBER ? tile.number : ""}
            </div>
          ))
        )}
      </div>
      <div className={styles.informations}>
        <p>Mines restantes: {minesLeft}</p>
        <div className="message">{message}</div>
        <button>Recommencer</button>
      </div>
    </div>
  );
}

function createBoard(boardSize, numberOfMines) {
  const board = [];
  const minePositions = getMinePositions(boardSize, numberOfMines);

  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const tile = {
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        status: TILE_STATUSES.HIDDEN,
        number: null, // Number of adjacent mines
      };

      row.push(tile);
    }
    board.push(row);
  }

  return board;
}

function markTile(tile) {
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  ) {
    return;
  }

  tile.status =
    tile.status === TILE_STATUSES.MARKED
      ? TILE_STATUSES.HIDDEN
      : TILE_STATUSES.MARKED;
}

function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) return;

  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    return;
  }

  tile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter((t) => t.mine);
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board));
  } else {
    tile.number = mines.length;
  }
}

function checkWin(board) {
  return board.every((row) =>
    row.every(
      (tile) =>
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
    )
  );
}

function checkLose(board) {
  return board.some((row) =>
    row.some((tile) => tile.status === TILE_STATUSES.MINE)
  );
}

function getMinePositions(boardSize, numberOfMines) {
  const positions = [];
  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position);
    }
  }

  return positions;
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

function nearbyTiles(board, { x, y }) {
  const tiles = [];
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) tiles.push(tile);
    }
  }
  return tiles;
}
