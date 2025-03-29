"use client";
import { useBox } from "@react-three/cannon";
import { Fragment } from "react";

export function BoardPhysicsStructure({
  rows = 6,
  columns = 7,
  slotRadius = 0.5,
  slotPadding = 0.25,
  thickness = 0.25,
  position = [0, 4, 0],
}) {
  const slotWidth = slotRadius * 2 + slotPadding;
  const totalWidth = columns * slotWidth;
  const totalHeight = rows * (slotRadius * 2 + slotPadding);

  const wallDepth = thickness;
  const wallThickness = 0.22;

  const baseY = position[1] - totalHeight / 2;

  // Outer walls (left, right, bottom, back)
  const outerWalls = [
    {
      position: [
        position[0] - totalWidth / 2 - wallThickness / 2,
        position[1],
        position[2],
      ],
      size: [wallThickness, totalHeight, wallDepth],
    },
    {
      position: [
        position[0] + totalWidth / 2 + wallThickness / 2,
        position[1],
        position[2],
      ],
      size: [wallThickness, totalHeight, wallDepth],
    },
    {
      position: [position[0], position[1], position[2] - wallDepth / 2 - 0.1],
      size: [totalWidth + wallThickness * 2, totalHeight, 0.2],
    },
    {
      position: [position[0], position[1], position[2] + wallDepth / 2 + 0.1],
      size: [totalWidth + wallThickness * 2, totalHeight, 0.2],
    },
  ];

  // Internal dividers between columns
  const columnWalls = Array.from({ length: columns - 1 }, (_, i) => {
    const x = position[0] - totalWidth / 2 + slotWidth * (i + 1);
    return {
      position: [x, position[1], position[2]],
      size: [wallThickness, totalHeight, wallDepth],
    };
  });

  const allWalls = [...outerWalls, ...columnWalls];

  return (
    <>
      {allWalls.map((wall, idx) => {
        const [ref] = useBox(() => ({
          args: wall.size,
          position: wall.position,
          mass: 0,
        }));
        return (
          <mesh key={idx} ref={ref}>
            <boxGeometry args={wall.size} />
            <meshStandardMaterial color="transparent" transparent opacity={0} />
          </mesh>
        );
      })}
    </>
  );
}
