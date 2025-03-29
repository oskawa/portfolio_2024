import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useState } from "react";
import { ref, set, update, get, onValue } from "firebase/database";
import { database } from "../../../../firebase";
export function ClickToDrop({
  onDrop,
  boardPosition,
  columns,
  slotRadius,
  slotPadding,
  uuid,
  playerId,
}) {
  const { camera, gl } = useThree();
  const [hoveredColumn, setHoveredColumn] = useState(null);
  let startMousePos = { x: 0, y: 0 };
  let isDragging = false;

  useEffect(() => {
    const handleMouseDown = (e) => {
      startMousePos = { x: e.clientX, y: e.clientY };
      isDragging = false;
    };
    const handleMouseMove = (e) => {
      const moveDistance = Math.sqrt(
        (e.clientX - startMousePos.x) ** 2 + (e.clientY - startMousePos.y) ** 2
      );

      if (moveDistance > 5) {
        isDragging = true; // If mouse moves significantly, it's a drag
      }

      // Raycasting for hover detection
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      };

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const BOARD_Z = boardPosition[2];
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, -1), -BOARD_Z);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      const slotWidth = slotRadius * 2 + slotPadding;
      const totalWidth = columns * slotWidth;
      const localX = intersection.x - (boardPosition[0] - totalWidth / 2);
      const colIndex = Math.floor(localX / slotWidth);

      if (colIndex >= 0 && colIndex < columns) {
        setHoveredColumn(colIndex);

        // 🔥 Send hover column to Firebase
        if (uuid) {
          update(ref(database, `games/${uuid}/hoveredColumn`), {
            playerId,
            colIndex,
          });
        }
      }
    };

    const handleClick = (e) => {
      if (isDragging) return; // Prevent accidental clicks & multiple drops

      const rect = gl.domElement.getBoundingClientRect();
      const mouse = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      };

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const BOARD_Z = boardPosition[2];
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, -1), -BOARD_Z); // z = BOARD_Z
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      const slotWidth = slotRadius * 2 + slotPadding;
      const totalWidth = columns * slotWidth;
      const localX = intersection.x - (boardPosition[0] - totalWidth / 2);
      const colIndex = Math.floor(localX / slotWidth);

      if (colIndex < 0 || colIndex >= columns) return;

      const x =
        -totalWidth / 2 +
        colIndex * slotWidth +
        slotWidth / 2 +
        boardPosition[0];
      const y = 7;
      const z = boardPosition[2];

      onDrop([x, y, z], colIndex);
    };

    gl.domElement.addEventListener("mousedown", handleMouseDown);
    gl.domElement.addEventListener("mousemove", handleMouseMove);
    gl.domElement.addEventListener("click", handleClick);

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("click", handleClick);
    };

  }, [camera, gl, boardPosition, columns, slotRadius, slotPadding, onDrop]);

  return null;
}
