import React, { useState, useEffect, useRef } from "react";
import styles from "./rubiks.module.scss";

export function RubiksWindow() {
  const [responseColor, setResponseColor] = useState([]);
  const [squareColor, setSquareColor] = useState(Array(24).fill("Empty")); // Initially filled with "Empty"
  const smallGridRef = useRef(null);
  const rubiksGridRef = useRef(null);

  useEffect(() => {
    createColorGrid("smallGridContainer", 9, styles.smallSquare);
    createColorGrid("rubiks", 24, styles.square);
  }, []);

  useEffect(() => {
    const handleArrowKeys = (event) => {
      const key = event.key;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        handleArrowKey(key);
      }
    };

    document.addEventListener("keydown", handleArrowKeys);

    return () => {
      document.removeEventListener("keydown", handleArrowKeys);
    };
  }, [squareColor]); // This will run every time squareColor changes

  const generateRandomColorsArray = (size) => {
    const colors = ["Green", "Blue", "Yellow", "Red", "White", "Orange"];
    const randomArray = [];

    if (size === 9) {
      for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * colors.length);
        randomArray.push(colors[randomIndex]);
      }
    } else {
      colors.forEach((color) => {
        for (let i = 0; i < 4; i++) {
          randomArray.push(color);
        }
      });
      randomArray.push("Empty");
    }

    for (let i = randomArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomArray[i], randomArray[j]] = [randomArray[j], randomArray[i]];
    }

    return randomArray;
  };

  const createColorGrid = (containerId, size, squareClass) => {
    const gridContainer =
      containerId === "smallGridContainer"
        ? smallGridRef.current
        : rubiksGridRef.current;
    const colorsArray = generateRandomColorsArray(size); // Ensure size is correctly set for 24

    if (size === 9) {
      setResponseColor(colorsArray);
    } else {
      setSquareColor(colorsArray);
    }

    // Clear any existing squares in the grid container
    gridContainer.innerHTML = "";

    colorsArray.forEach((color, index) => {
      const square = document.createElement("div");
      square.classList.add(squareClass, styles[color.toLowerCase()]);

      if (size !== 9) {
        square.addEventListener("click", () =>
          handleSquareClick(index, colorsArray, size, containerId, squareClass)
        );
      }

      gridContainer.appendChild(square);
    });
  };

  const handleSquareClick = (
    index,
    colorsArray,
    size,
    containerId,
    squareClass
  ) => {
    const clickedColor = colorsArray[index];

    if (checkAdjacent(index, "Empty", size)) {
      colorsArray[index] = "Empty";
      colorsArray[getAdjacentIndex(index, "Empty", size)] = clickedColor;
      updateGrid(containerId, size, squareClass, colorsArray);
    }
  };

  const checkAdjacent = (index, className, size) => {
    const adjacentIndexes = getAdjacentIndexes(index, size);
    return adjacentIndexes.some(
      (adjIndex) => squareColor[adjIndex] === className
    );
  };

  const getAdjacentIndexes = (index, size) => {
    const row = Math.floor(index / Math.sqrt(size));
    const col = index % Math.sqrt(size);

    const topIndex = index - Math.sqrt(size);
    const bottomIndex = index + Math.sqrt(size);
    const leftIndex = index - 1;
    const rightIndex = index + 1;

    return [topIndex, bottomIndex, leftIndex, rightIndex].filter((adjIndex) => {
      const adjRow = Math.floor(adjIndex / Math.sqrt(size));
      const adjCol = adjIndex % Math.sqrt(size);
      return (
        adjRow >= 0 &&
        adjRow < Math.sqrt(size) &&
        adjCol >= 0 &&
        adjCol < Math.sqrt(size)
      );
    });
  };

  const getAdjacentIndex = (index, className, size) => {
    const adjacentIndexes = getAdjacentIndexes(index, size);
    return adjacentIndexes.find(
      (adjIndex) => squareColor[adjIndex] === className
    );
  };

  function getValuesAtSpecificIndexes(response, squareAnswer) {
    const valuesToRetrieve = [6, 7, 8, 11, 12, 13, 16, 17, 18];
    const retrievedValues = valuesToRetrieve.map((index) => response[index]);

    const retrievedValuesString = JSON.stringify(retrievedValues);
    const anotherArrayString = JSON.stringify(squareAnswer);

    const areIdentical = retrievedValuesString === anotherArrayString;

    if (!areIdentical) {
      const gridContainer = document.getElementById("rubiks");
      gridContainer.classList.add(styles.active);
      setTimeout(() => {
        gridContainer.classList.remove(styles.active);
      }, 1300);
    }else{
      
    }
  }

  const updateGrid = (containerId, size, squareClass, colorsArray) => {
    const gridContainer =
      containerId === "smallGridContainer"
        ? smallGridRef.current
        : rubiksGridRef.current;
    gridContainer.innerHTML = "";

    colorsArray.forEach((color, index) => {
      const square = document.createElement("div");
      square.classList.add(squareClass, styles[color.toLowerCase()]);

      if (containerId === "rubiks") {
        square.addEventListener("click", () =>
          handleSquareClick(index, colorsArray, size, containerId, squareClass)
        );
      }

      gridContainer.appendChild(square);
    });
  };

  const handleArrowKey = (key) => {
    const currentIndex = squareColor.indexOf("Empty");
    let newIndex;
    const rowLength = 5; // Assuming a 5x5 grid
    const currentRow = Math.floor(currentIndex / rowLength);
    const currentCol = currentIndex % rowLength;

    switch (key) {
      case "ArrowUp":
        if (currentRow > 0) {
          // Prevent moving up if on the first row
          newIndex = currentIndex - rowLength;
        }
        break;
      case "ArrowDown":
        if (currentRow < rowLength - 1) {
          // Prevent moving down if on the last row
          newIndex = currentIndex + rowLength;
        }
        break;
      case "ArrowLeft":
        if (currentCol > 0) {
          // Prevent moving left if in the first column
          newIndex = currentIndex - 1;
        }
        break;
      case "ArrowRight":
        if (currentCol < rowLength - 1) {
          // Prevent moving right if in the last column
          newIndex = currentIndex + 1;
        }
        break;
      default:
        return;
    }

    if (newIndex >= 0 && newIndex < squareColor.length) {
      const updatedColors = [...squareColor];
      updatedColors[currentIndex] = updatedColors[newIndex];
      updatedColors[newIndex] = "Empty";
      setSquareColor(updatedColors);
      updateGrid("rubiks", squareColor.length, styles.square, updatedColors);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.rubiksInner}>
        <div id="rubiks" ref={rubiksGridRef} className={styles.gridContainer} />
        <div className={styles.rubiksHelper}></div>
      </div>

      <div className={styles.results}>
        <h5>Pattern à trouver : </h5>
        <div
          id="smallGridContainer"
          ref={smallGridRef}
          className={styles.smallContainer}
        />
        <button
          onClick={() => getValuesAtSpecificIndexes(squareColor, responseColor)}
        >
          Valider
        </button>
      </div>
    </div>
  );
}
