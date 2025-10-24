import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

// Camera animation component
function AnimatedCamera({ targetPosition }) {
  const cameraRef = useRef();

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.x +=
        (targetPosition[0] - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y +=
        (targetPosition[1] - cameraRef.current.position.y) * 0.05;
      cameraRef.current.position.z +=
        (targetPosition[2] - cameraRef.current.position.z) * 0.05;
    }
  });

  return (
    <PerspectiveCamera ref={cameraRef} makeDefault position={targetPosition} />
  );
}

export const SceneCanvas = ({
  targetPosition,
  showOrbitControls = false,
  style,
}) => {
  return (
    <Canvas style={style}>
      <AnimatedCamera targetPosition={targetPosition} />
      {showOrbitControls && <OrbitControls />}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    </Canvas>
  );
};
