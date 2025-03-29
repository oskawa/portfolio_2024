"use client";
import { useCylinder } from "@react-three/cannon";
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";

export function Coin({ position = [0, 0, 0], color = "gold" }) {
  const meshRef = useRef();
  const [ref, api] = useCylinder(() => {
    const quat = new THREE.Quaternion();
    quat.setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)); // Flat coin
    return {
      mass: 1,
      position,
      args: [0.5, 0.5, 0.23, 16],
      quaternion: [quat.x, quat.y, quat.z, quat.w], // ⬅️ Apply at creation time
    };
  });

  return (
    <mesh ref={ref} castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.5, 0.5, 0.23, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
