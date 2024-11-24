import React, { useState, useEffect, useCallback } from "react";
import styles from "./tetris.module.scss";

const width = 10; // Grid width
const height = 20; // Grid height
const totalCells = width * height;

// Tetromino shapes
const tetrominoes = [
    // L-Block
    [
        [1, width + 1, width * 2 + 1, 2], // 0° rotation
        [width, width + 1, width + 2, width * 2 + 2], // 90° rotation
        [1, width + 1, width * 2 + 1, width * 2], // 180° rotation
        [width, width * 2, width * 2 + 1, width * 2 + 2], // 270° rotation
    ],
    // Add more tetromino shapes here
];

export function TetrisWindow() {
    const [grid, setGrid] = useState([]);
    const [currentTetromino, setCurrentTetromino] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(4); // Starting position
    const [currentRotation, setCurrentRotation] = useState(0); // Rotation index
    const [intervalId, setIntervalId] = useState(null);

    // Initialize grid
    useEffect(() => {
        const initialGrid = Array(totalCells).fill("");
        setGrid(initialGrid);
    }, []);

    // Draw the current tetromino
    const draw = useCallback(() => {
        const newGrid = [...grid];
        currentTetromino.forEach((index) => {
            const pos = currentPosition + index;
            if (pos >= 0 && pos < totalCells) newGrid[pos] = styles.tetromino;
        });
        setGrid(newGrid);
    }, [grid, currentTetromino, currentPosition]);

    // Undraw the current tetromino
    const undraw = useCallback(() => {
        const newGrid = [...grid];
        currentTetromino.forEach((index) => {
            const pos = currentPosition + index;
            if (pos >= 0 && pos < totalCells) newGrid[pos] = "";
        });
        setGrid(newGrid);
    }, [grid, currentTetromino, currentPosition]);

    // Check if the tetromino is at the bottom or collides with "taken" cells
    const isAtBottomOrCollision = useCallback(() => {
        return currentTetromino.some((index) => {
            const pos = currentPosition + index;
            const belowPos = pos + width;
            return (
                belowPos >= totalCells || // Bottom of the grid
                (grid[belowPos] && grid[belowPos] === styles.taken) // Collision
            );
        });
    }, [currentTetromino, currentPosition, grid]);

    // Move the tetromino down
    const moveDown = useCallback(() => {
        undraw();

        if (isAtBottomOrCollision()) {
            // Lock the tetromino in place
            const newGrid = [...grid];
            currentTetromino.forEach((index) => {
                const pos = currentPosition + index;
                if (pos >= 0 && pos < totalCells) newGrid[pos] = styles.taken;
            });
            setGrid(newGrid);

            // Spawn a new tetromino
            spawnNewTetromino();
        } else {
            setCurrentPosition((pos) => pos + width);
        }

        draw();
    }, [undraw, draw, isAtBottomOrCollision, currentTetromino, grid]);

    // Spawn a new tetromino
    const spawnNewTetromino = useCallback(() => {
        const randomTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
        setCurrentTetromino(randomTetromino[currentRotation]);
        setCurrentPosition(4); // Reset position
    }, [currentRotation]);

    // Move left
    const moveLeft = () => {
        undraw();
        const isAtLeftEdge = currentTetromino.some((index) => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) setCurrentPosition((pos) => pos - 1);
        draw();
    };

    // Move right
    const moveRight = () => {
        undraw();
        const isAtRightEdge = currentTetromino.some(
            (index) => (currentPosition + index) % width === width - 1
        );
        if (!isAtRightEdge) setCurrentPosition((pos) => pos + 1);
        draw();
    };

    // Start the game
    const startGame = () => {
        spawnNewTetromino();
        const id = setInterval(() => {
            moveDown();
        }, 1000); // 1-second interval
        setIntervalId(id);
    };

    // Stop the game
    const stopGame = () => {
        clearInterval(intervalId);
        setIntervalId(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.tetrisGrid}>
                {grid.map((cell, i) => (
                    <div key={i} className={`${styles.gridCell} ${cell}`} />
                ))}
            </div>
            <div className={styles.controls}>
                <button onClick={startGame}>Start Game</button>
                <button onClick={stopGame}>Stop Game</button>
                <button onClick={moveLeft}>Move Left</button>
                <button onClick={moveRight}>Move Right</button>
            </div>
        </div>
    );
}
