import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import http from "../../../axios/http";
import { OrbitControls, PointerLockControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import Stats from "stats.js"; // Import the stats.js library
import styles from "./virtualvisit.module.scss";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'; // Import FBXLoader
import { AnimationMixer, Euler, MathUtils } from 'three';


import {
  ref,
  push,
  set,
  onValue,
  onDisconnect,
  remove,
  update,
} from "firebase/database";

import { database } from "../../../firebase";
function Player({
  collisionObjects,
  position,
  updatePosition,

  disableControls,
  onUnlock,
}) {
  const { camera } = useThree();
  const playerRef = useRef(null);
  const controlsRef = useRef();
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
    camera.position.set(0, 1.8, -2);
  }, [camera]);

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

  useEffect(() => {
    const controls = controlsRef.current;
    if (controls) {
      const handleUnlock = () => {
        onUnlock(); // Call the provided function when unlocked
      };

      controls.addEventListener("unlock", handleUnlock);
      return () => controls.removeEventListener("unlock", handleUnlock);
    }
  }, [onUnlock]);

  // Movement and collision detection with cube bounding camera
  useFrame((state, delta) => {
    if (cubeBoundingCamera.current) {
      // Update the bounding cube position based on the camera's position
      cubeBoundingCamera.current.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z
      );

      position = cubeBoundingCamera.current.position;

      // Extract rotation from quaternion
      const euler = new Euler().setFromQuaternion(camera.quaternion, 'YXZ');

      // Convert radians to degrees
      const rotationX = THREE.MathUtils.radToDeg(euler.x); // Pitch
      const rotationY = THREE.MathUtils.radToDeg(euler.y); // Yaw
      const rotationZ = THREE.MathUtils.radToDeg(euler.z); // Roll




      const rotation = { x: rotationX, y: rotationY, z: rotationZ };
      updatePosition(position, rotation);
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
      {!disableControls && <PointerLockControls ref={controlsRef} />}
      {/* Invisible cube surrounding the camera for collision detection */}
      <mesh ref={cubeBoundingCamera}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </>
  );
}

function ChatInput(playerId) {

  const [isInputVisible, setIsInputVisible] = useState(false); // Show/hide input
  const [message, setMessage] = useState(""); // Current message text
  const inputRef = useRef(null); // Reference to the input element

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "t" || e.key === "T") {
        setIsInputVisible(true);


      }
    }

    // Add event listener for keypress
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    // Focus the input field when it becomes visible
    if (isInputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputVisible]);

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      console.log('test')
      console.log(playerId)
      // Send message to Firebase
      const playerMessageRef = ref(database, `messages/`);
      update(playerMessageRef, {
        player: playerId.playerId,
        message: message
      });
      // Clear the input and hide it
      setMessage("");
      setIsInputVisible(false);
    }
  }

  return (
    <div className={styles.chatInnerText}>
      {isInputVisible && (
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          style={{
            zIndex: "10000",
            display: "block",
            position: "absolute", // Position the input (you can customize)
            bottom: "30px",
            width: "300px",
            height: "30px",
            padding: "10px",
            left: "25px",
          }}
        />
      )}
    </div>
  );
}


function Chat() {
  const [messages, setMessages] = useState([]); // Array to store messages

  useEffect(() => {
    const playerMessageRef = ref(database, `messages`);

    const unsubscribe = onValue(playerMessageRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val(); // Get the current message and player
        const newMessage = { player: data.player, message: data.message };

        // Add the new message to the array, ensuring no duplicates
        setMessages((prevMessages) => [
          ...prevMessages,
          newMessage,
        ]);
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [database]);

  return (
    <div
      className={styles.chatInner}
      style={{
        position: "absolute",
        bottom: "60px",
        left: "25px",
        padding: "10px",
        width: "300px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        borderRadius: "5px",
        zIndex: 100
      }}
    >
      {/* Display all messages as a list */}
      {messages.map((msg, index) => (
        <div key={index} style={{ marginBottom: "5px" }}>
          <strong>{msg.player}:</strong> <p>{msg.message}</p>
        </div>
      ))}
    </div>
  );
}

function Character({ id, position, rotation, color }) {
  console.log(id)
  // Load the FBX files for idle and walking animations
  const idleModel = useLoader(FBXLoader, `gltf/character/idle.fbx?${id}`);
  const walkingModel = useLoader(FBXLoader, `gltf/character/walk.fbx?${id}`);
  const [currentAnimation, setCurrentAnimation] = useState("idle"); // React state for animation


  const group = useRef();
  const [isMoving, setIsMoving] = useState(false); // Track if the character is moving
  const currentAnimationRef = useRef('idle'); // Use a ref for current animation


  const idleMixer = useRef(null);
  const walkMixer = useRef(null);


  const prevPosition = useRef(new THREE.Vector3()); // Initialize the reference
  const lastMoveTime = useRef(Date.now()); // Track when the position last changed

  const rotationYInRadians = MathUtils.degToRad(rotation.y);
  const eulerRotation = new Euler(0, rotationYInRadians, 0);

  const idleAction = useRef(null);
  const walkAction = useRef(null);

  // Initialize mixers and actions on model load
  useEffect(() => {
    if (idleModel && idleModel.animations.length > 0) {
      idleMixer.current = new THREE.AnimationMixer(idleModel);
      idleAction.current = idleMixer.current.clipAction(idleModel.animations[0]);
      idleAction.current.setLoop(THREE.LoopRepeat);
      idleAction.current.play();
    }

    if (walkingModel && walkingModel.animations.length > 0) {
      walkMixer.current = new THREE.AnimationMixer(walkingModel);
      walkAction.current = walkMixer.current.clipAction(walkingModel.animations[0]);
      walkAction.current.setLoop(THREE.LoopRepeat);
      walkAction.current.play();
    }

  }, [idleModel, walkingModel]);


  useFrame(() => {
    const currentPosition = new THREE.Vector3(position[0], position[1], position[2]); // Assuming position is an object {x, y, z}
    const distance = prevPosition.current.distanceTo(currentPosition);
    if (distance > 0.01) {
      if (!isMoving) {
        setIsMoving(true); // Set moving state if it's not already moving
      }
      lastMoveTime.current = Date.now(); // Reset the idle timer
    } else {
      // Calculate idle time
      const timeElapsed = Date.now() - lastMoveTime.current;
      if (timeElapsed > 500 && isMoving) {
        setIsMoving(false); // Set to idle after 500ms of no movement

      }
    }

    // Update the animation mixers
    walkMixer.current?.update(0.01);
    idleMixer.current?.update(0.01);


    if (isMoving && currentAnimation !== "walk") {
      walkAction.current.play();
      idleAction.current.stop();
      setCurrentAnimation("walk");
    } else if (!isMoving && currentAnimation !== "idle") {
      walkAction.current.stop();
      idleAction.current.play();
      setCurrentAnimation("idle");
    }
    prevPosition.current.copy(currentPosition);


  });





  return (
    <group ref={group} rotation={eulerRotation} position={position}>
      {/* Render the appropriate model based on current animation */}
      {currentAnimation === 'idle' && <primitive object={idleModel} rotation={[0, Math.PI, 0]} />}
      {currentAnimation === 'walk' && <primitive object={walkingModel} rotation={[0, Math.PI, 0]} />}

      {/* Optional: Add a box to visualize the group movement */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color={color || 'red'} />
      </mesh>
    </group>
  );
};



function Scene({ playerId, disableControls, onUnlock, selectedColor }) {
  const collisionObjects = useRef([]);
  const [playerPosition, setPlayerPosition] = useState(
    new THREE.Vector3(0, 1.5, -2)
  );
  const [otherPlayers, setOtherPlayers] = useState([]);

  const { scene: modelScene1 } = useGLTF("gltf/scenethree_fusion.glb");
  const { scene: modelScene } = useGLTF("gltf/scenethree.glb");



  useEffect(() => {
    modelScene.traverse((child) => {
      if (child.material) {
        child.material.metalness = 0;

      }
      if (child.isMesh) {
        child.visible = false; // Alternatively, hide the entire object

        child.geometry.computeBoundingBox();
        if (child.name.includes("wall") || child.name.includes("stair")) {
          collisionObjects.current.push(child);
        } else if (child.name == "floor") {
        }

      }
    });
    modelScene1.traverse((child1) => {
      if (child1.material) child1.material.metalness = 0;
    })
  }, [modelScene1, modelScene]);

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
          const idother = id
          updatedPlayers.push({
            id: idother,
            position: new THREE.Vector3(pos.x, pos.y, pos.z),
            rotation: new THREE.Vector3(pos.rotx, pos.roty, pos.rotz),
            color: pos.color,
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

  const updatePlayerPositionInFirebase = (position, rotation) => {
    const playerRef = ref(database, "players/" + playerId);
    update(playerRef, {
      x: position.x,
      y: position.y,
      z: position.z,
      roty: rotation.y,
      color: selectedColor, // Ensure color is preserved
    });
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

  const updatePosition = (newPosition, newRotation) => {
    setPlayerPosition(newPosition);
    updatePlayerPositionInFirebase(newPosition, newRotation);
  };
  return (
    <>
      <primitive object={modelScene1} />
      <primitive object={modelScene} />

      {/* Player */}
      <Player
        collisionObjects={collisionObjects}
        position={playerPosition}
        updatePosition={updatePosition}


        disableControls={disableControls}
        onUnlock={onUnlock}
      />
      {otherPlayers.map((player) => (

        <Character
          key={player.id}
          id={player.id}
          rotation={player.rotation}
          position={[player.position.x, 0.4, player.position.z]}
          color={player.color}
        />
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

async function getPaintings() {
  try {
    const response = await http.get("paintListing");
    return response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return null;
  }
}

export function VirtualVisitWindow() {
  const [paints, setPaints] = useState([]);
  const [loading, setLoading] = useState([]);
  const [nolock, setNolock] = useState(true);
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const [showEscapeMenu, setShowEscapeMenu] = useState(false);

  useEffect(() => {
    const fetchPaints = async () => {
      const PaintsAsync = await getPaintings();

      setPaints(PaintsAsync);
      setLoading(false);
    };
    fetchPaints();
  }, []);

  const handleNoLock = () => {
    setNolock(!nolock);
  };
  const handleDisableControls = () => {
    setShowEscapeMenu(true);
  };
  const handleColorChange = (event) => {
    setSelectedColor(event.target.value); // Update the color state
  };

  const [playerId] = useState(() => {
    const max = 100; // Replace with any max value
    const randomInt = Math.floor(Math.random() * max);
    return "player" + randomInt;
  });

  const texture = useLoader(THREE.TextureLoader, "img/textures/wood-dif.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16); // Adjust as needed
  const skyboxImages = [
    "gltf/skybox/clouds1_east.jpg",
    "gltf/skybox/clouds1_west.jpg",
    "gltf/skybox/clouds1_up.jpg",
    "gltf/skybox/clouds1_down.jpg", // OK
    "gltf/skybox/clouds1_north.jpg",
    "gltf/skybox/clouds1_south.jpg",

  ];

  const cubeTexture = new THREE.CubeTextureLoader().load(skyboxImages);


  const displacementMap = useLoader(
    THREE.TextureLoader,
    "img/textures/wood-displacement.png"
  );
  return (
    <div className={styles.inner}>
      {nolock && (
        <>
          <div className={styles.home}>
            <h2>Visite virtuelle</h2>
            <p>
              Invitez vos amis à découvrir une salle d'exposition où vous pouvez
              vous déplacer librement pour découvrir des oeuvres créées avec
              passion.
            </p>
            <div className={styles.color}>
              <label htmlFor="colorPicker">Choisissez une couleur:</label>
              <input
                id="colorPicker"
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
              />
            </div>
            <button className={`${loading ? styles.disabled : ''}`} onClick={handleNoLock}>Découvrir l'exposition</button>
            <div className={styles.howToPlay}>
              <img src="./img/virtual/howtoplay.png" alt="" />
            </div>
          </div>
        </>
      )}
      {showEscapeMenu && (
        <div className={styles.escapeMenu}>
          {/* Displayed when Escape is pressed */}
          <div className={styles.escapeMenu__Inner}>
            <p>Pause</p>
            <button onClick={() => setShowEscapeMenu(false)}>Resume</button>
          </div>
        </div>
      )}

      <div className={`${styles.canvasWrapper} ${nolock ? "" : styles.active}`}>
        <ChatInput playerId={playerId} />
        <Chat />

        <Canvas>
          {!loading && (
            <>
              <primitive object={cubeTexture} attach="background" />
              <ambientLight position={[10, 10, 5]} intensity={1} />
              <directionalLight position={[10, 10, 5]} intensity={2} />
              <Scene
                playerId={playerId}
                disableControls={showEscapeMenu}
                onUnlock={handleDisableControls}
                selectedColor={selectedColor}
              />

              {paints.map((painting, index) => {
                // Load texture from the image URL

                let img = painting.image["url"];

                // Load the texture and set the crossOrigin property
                const texture = useLoader(
                  THREE.TextureLoader,
                  img,
                  (texture) => {
                    texture.crossOrigin = "anonymous"; // This enables CORS handling
                  }
                );

                // Set default values for position
                const x = painting.paint_x || 0;
                const z = painting.paint_y || 0;
                const y = 1.9; // Default Z position
                let rotationY = 0; // No rotation needed for "north"
                switch (painting.face) {
                  case "south":
                    rotationY = Math.PI; // 180 degrees
                    break;
                  case "east":
                    rotationY = Math.PI / 2; // 90 degrees
                    break;
                  case "west":
                    rotationY = -Math.PI / 2; // -90 degrees
                    break;
                  // "north" is the default case, so no need for rotation
                  default:
                    break;
                }

                return (
                  <>

                    <mesh
                      key={index}
                      position={[x, y, z]}
                      rotation={[0, rotationY, 0]}
                    >
                      <planeGeometry
                        args={[
                          painting.image["sizes"]["large-width"] / 500,
                          painting.image["sizes"]["large-height"] / 500,
                        ]}
                      />{" "}
                      {/* Adjust size as needed */}
                      <meshStandardMaterial map={texture} />
                    </mesh>
                    <mesh
                     
                      position={[x, y, z]} // Match the position of your painting
                    >
                      <boxGeometry args={[1, 1, 1]} /> {/* Adjust size as needed */}
                      <meshBasicMaterial color="red" transparent opacity={0} />
                    </mesh>
                  </>
                );
              })}
            </>
          )}
        </Canvas>
      </div>

    </div>
  );
}
