import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ref, push, set, onValue, onDisconnect, remove } from "firebase/database";

import { database } from "../../../firebase";
import { OrbitControls, PointerLockControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Stats from "stats.js"; // Import the stats.js library
function Player({ collisionObjects, position, updatePosition }) {
  const { camera } = useThree();
  const playerRef = useRef(null);
  const cubeBoundingCamera = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const speed = 5;
  const [move, setMove] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });

  useEffect(() => {
    camera.position.set(0, 1.5, -2);
  }, [camera]);

  useFrame(() => {
    if (cubeBoundingCamera.current) {
      // Update the bounding cube position based on the camera's position
      cubeBoundingCamera.current.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z
      );
      position = cubeBoundingCamera.current.position;
      updatePosition(position);
    }
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      setMove((prev) => {
        const newState = { ...prev };
        switch (event.code) {
          case "ArrowUp":
          case "KeyW":
            newState.forward = true;
            break;
          case "ArrowLeft":
          case "KeyA":
            newState.left = true;
            break;
          case "ArrowDown":
          case "KeyS":
            newState.backward = true;
            break;
          case "ArrowRight":
          case "KeyD":
            newState.right = true;
            break;
        }
        return newState;
      });
    };

    const handleKeyUp = (event) => {
      setMove((prev) => {
        const newState = { ...prev };
        switch (event.code) {
          case "ArrowUp":
          case "KeyW":
            newState.forward = false;
            break;
          case "ArrowLeft":
          case "KeyA":
            newState.left = false;
            break;
          case "ArrowDown":
          case "KeyS":
            newState.backward = false;
            break;
          case "ArrowRight":
          case "KeyD":
            newState.right = false;
            break;
        }
        return newState;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Movement and collision detection with cube bounding camera
  useFrame((state, delta) => {
    if (playerRef.current) {
      playerRef.current.position.set(position.x, position.y, position.z);
    }

    direction.set(0, 0, 0);
    if (move.forward) direction.z -= 1;
    if (move.backward) direction.z += 1;
    if (move.left) direction.x -= 1;
    if (move.right) direction.x += 1;
    if (move.up) direction.y += 1;
    if (move.down) direction.y -= 1;

    direction.normalize(); // Normalizes the direction vector to ensure consistent speed

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward); // Get camera forward direction
    forward.y = 0; // Restrict to horizontal plane
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, camera.up);

    // Calculate velocity based on camera direction
    velocity.set(0, 0, 0);
    if (move.forward) velocity.add(forward.multiplyScalar(speed * delta));
    if (move.backward) velocity.add(forward.multiplyScalar(-speed * delta));
    if (move.left) velocity.add(right.multiplyScalar(-speed * delta));
    if (move.right) velocity.add(right.multiplyScalar(speed * delta));
    if (move.up) velocity.y += speed * delta;
    if (move.down) velocity.y -= speed * delta;

    // Calculate the next position
    const nextPosition = camera.position.clone().add(velocity);

    // Set the cube bounding camera position for collision detection
    cubeBoundingCamera.current.position.copy(nextPosition);
    cubeBoundingCamera.current.updateMatrixWorld();

    const cameraBox = new THREE.Box3().setFromObject(
      cubeBoundingCamera.current
    );

    let collision = false;
    let isOnStair = false;

    // Loop through the collision objects to detect if the camera intersects any
    for (const obj of collisionObjects.current) {
      const objBox = new THREE.Box3().setFromObject(obj);
      if (cameraBox.intersectsBox(objBox)) {
        if (obj.name.includes("stair")) {
          isOnStair = true;

          // If on a stair, move the camera up/down based on the stair's orientation

          camera.position.y += speed * delta; // Move camera up on stairs
        } else {
          // If collision occurs and it's not a stair, stop movement
          collision = true;
          break;
        }
      }
    }

    // Cast a ray downwards from the camera to detect if it is close to the ground
    const rayOrigin = camera.getWorldPosition(new THREE.Vector3()); // Move it 1 unit in front of the camera
    raycaster.set(rayOrigin, new THREE.Vector3(0, -2, 0)); // Ray downwards
    const intersects = raycaster.intersectObjects(
      collisionObjects.current,
      true
    );

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const intersectedMesh = intersect.object;

      if (intersectedMesh.userData.name == "stair") {
        // move the camera up or down on the stair based on the moveForward variable
        if (intersect.distance > 1 && !isOnStair) {
          camera.position.y -= speed * delta;
        }
      } else if (intersectedMesh.name.includes("floor")) {
        if (intersect.distance > 1) {
          camera.position.y = 1;
        }
      }
    }

    // If no collision and we're not on a stair, set camera to the next position
    if (!collision && !isOnStair) {
      camera.position.set(nextPosition.x, camera.position.y, nextPosition.z);
    }
  });

  return (
    <>
      <PointerLockControls />
      {/* Invisible cube surrounding the camera for collision detection */}
      <mesh ref={cubeBoundingCamera}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </>
  );
}

function Scene({ playerId }) {
  const collisionObjects = useRef([]);
  const [playerPosition, setPlayerPosition] = useState(
    new THREE.Vector3(0, 1.5, -2)
  );
  const [otherPlayers, setOtherPlayers] = useState([]);

  const { scene: modelScene } = useGLTF("gltf/scenetwo.glb");
  useEffect(() => {
    modelScene.traverse((child) => {
      if (child.material) child.material.metalness = 0;
      if (child.isMesh) {
        child.geometry.computeBoundingBox();
        if (child.name.includes("wall") || child.name.includes("stair")) {
          collisionObjects.current.push(child);
        }
      }
    });
    console.log(collisionObjects);
  }, [modelScene]);

  // Retrieve all players' positions except the current player
  useEffect(() => {
    const playersRef = ref(database, "players");

    // Listen to changes in players data
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const playersData = snapshot.val() || {}; // Ensure playersData is an object
      const updatedPlayers = [];

      // Loop through players and update positions of other players
      for (let id in playersData) {
        if (id !== playerId) {
          // Exclude current player
          const pos = playersData[id];
          updatedPlayers.push({
            id,
            position: new THREE.Vector3(pos.x, pos.y, pos.z),
          });
        }
      }

      // Only update if there are changes to avoid unnecessary re-renders
      setOtherPlayers((prevPlayers) => {
        const hasChanged =
          JSON.stringify(prevPlayers) !== JSON.stringify(updatedPlayers);
        return hasChanged ? updatedPlayers : prevPlayers;
      });
    });

    // Clean up the Firebase listener on unmount
    return () => unsubscribe();
  }, [playerId]);

  const updatePlayerPositionInFirebase = (position) => {
    const playerRef = ref(database, "players/" + playerId);
    set(playerRef, { x: position.x, y: position.y, z: position.z });
  };

  useEffect(() => {
    const userRef = ref(database, `players/${playerId}`);
    // Set up removal on disconnect
    onDisconnect(userRef).remove();
  
    return () => {
      // Optionally remove player manually if you want to ensure they are removed immediately on unmount
      remove(userRef);
    };
  }, [playerId]);

  const updatePosition = (newPosition) => {
    setPlayerPosition(newPosition);
    updatePlayerPositionInFirebase(newPosition);
  };

  return (
    <>
      <primitive object={modelScene} />

      {/* Player */}
      <Player
        collisionObjects={collisionObjects}
        position={playerPosition}
        updatePosition={updatePosition}
      />
      {otherPlayers.map((player) => (
        <mesh key={player.id} position={player.position}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      ))}
    </>
  );
}
function FPSMonitor() {
  const statsRef = useRef(null);

  // Set up the stats monitor
  useEffect(() => {
    statsRef.current = new Stats();
    document.body.appendChild(statsRef.current.dom);
  }, []);

  useFrame(() => {
    if (statsRef.current) statsRef.current.update();
  });

  return null;
}

export function VirtualVisitWindow() {
  const max = 100; // Replace with any max value
  const randomInt = Math.floor(Math.random() * max);
  let playerId = "player" + randomInt;
  return (
    <Canvas>
      <FPSMonitor />
      <ambientLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <Scene playerId={playerId} />
    </Canvas>
  );
}
