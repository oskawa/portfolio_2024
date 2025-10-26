import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera } from "@react-three/drei";
import * as THREE from 'three';
// Camera animation component
function AnimatedCamera({ targetPosition, targetRotation }) {
  const cameraRef = useRef();
  const initialized = useRef(false);

  useEffect(() => {
    console.log('mounted moi encore!');
    return () => console.log('unmounted moi!');
  }, []);

  useFrame(() => {
    if (cameraRef.current) {
      const target = new THREE.Vector3(...targetPosition);
      cameraRef.current.position.lerp(target, 0.05);

      const targetRot = new THREE.Euler(...targetRotation);
      cameraRef.current.rotation.x += (targetRot.x - cameraRef.current.rotation.x) * 0.05;
      cameraRef.current.rotation.y += (targetRot.y - cameraRef.current.rotation.y) * 0.05;
      cameraRef.current.rotation.z += (targetRot.z - cameraRef.current.rotation.z) * 0.05;
    }

    // menu: { position: [-9, 1, -3], rotation: [0, 2.2, 0] },
  });
  return (
    // <PerspectiveCamera ref={cameraRef} makeDefault />
    <PerspectiveCamera ref={cameraRef} makeDefault />
  );
}

function Scene() {
  const { scene: modelScene1 } = useGLTF("gltf/quizz/test1.glb");
  return (
    <>
      <primitive object={modelScene1} />
    </>
  )
}

export const SceneCanvas = React.memo(({
  targetPosition,
  targetRotation,
  showOrbitControls = false,
  style,
}) => {
  return (
    <Canvas style={style}>
      <AnimatedCamera targetPosition={targetPosition} targetRotation={targetRotation} showOrbitControls={showOrbitControls} />

      <Scene />
      <ambientLight intensity={2000} />
      <directionalLight position={[10, 10, 5]} intensity={2} />

    </Canvas>
  );
});
