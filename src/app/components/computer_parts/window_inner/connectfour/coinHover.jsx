"use client";
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
export function CoinHover({ hoverColumn = 0, color = "gold" }) {
  console.log("Rendering CoinHover, hoverColumn:", hoverColumn);

  return (
    <mesh
      position={[hoverColumn * 1.27 - 3.9, 6, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <cylinderGeometry args={[0.5, 0.5, 0.23, 16]} />
      <meshStandardMaterial color={color} opacity={0.5} />
    </mesh>
  );
}
