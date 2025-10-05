// components/GameBoard.jsx
import React from "react";

const GameBoard = ({ width, height, children }) => {
  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,

        backgroundColor: "#4CAF50", // green field
        border: "4px solid white",
        overflow: "hidden",
        margin: "auto",
      }}
    >
      {/* Goals */}
      <div
        style={{
          position: "absolute",
          width: "20px",
          height: "100px",
          backgroundColor: "white",
          left: 0,
          top: `${(height - 100) / 2}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "20px",
          height: "100px",
          backgroundColor: "white",
          right: 0,
          top: `${(height - 100) / 2}px`,
        }}
      />

      {React.Children.map(children, (child) =>
        React.cloneElement(child, { width, height })
      )}
    </div>
  );
};

export default GameBoard;
