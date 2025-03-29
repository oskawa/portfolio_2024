import * as THREE from "three";

import { useRef, useMemo } from "react";

export function GameBoard({
  rows = 6,
  columns = 7,
  slotRadius = 0.38,
  slotPadding = 0.1,

  thickness = 0.5, // Depth circle
  position = [0, 3, -0.2],
}) {
  const wallThickness = 0.22;
  const slotWidth = slotRadius * 2 + slotPadding;
  const width = 9;
  const height = 6;

  // Memoize geometry generation
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, -height / 2);
    shape.lineTo(-width / 2, height / 2);
    shape.lineTo(width / 2, height / 2);
    shape.lineTo(width / 2, -height / 2);
    shape.lineTo(-width / 2, -height / 2);

    const slotPaddingX = 0.5;
    const slotPaddingY = 0.25;

    // Add circular holes
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x =
          col * (slotRadius * 2 + slotPaddingX) -
          width / 2 +
          slotRadius +
          slotPaddingX / 2;
        const y =
          row * (slotRadius * 2 + slotPaddingY) -
          height / 2 +
          slotRadius +
          slotPaddingY / 2;
        const hole = new THREE.Path();
        hole.absarc(x, y, slotRadius, 0, Math.PI * 2, true);
        shape.holes.push(hole);
      }
    }

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: false,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [rows, columns, slotRadius, thickness]);

  return (
    <mesh geometry={geometry} position={position} castShadow receiveShadow>
<meshStandardMaterial color="#0D47A1" side={THREE.DoubleSide} />
</mesh>
  );
}
