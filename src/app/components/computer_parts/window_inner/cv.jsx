import http from "./../../../axios/http";
import styles from "./cv.module.scss";

import { useRef, useEffect, useState } from "react";
export function CvWindow() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  const [image, setImage] = useState([]);
  const [strokeColor, setStrokeColor] = useState("red"); // Default color

  const icons = [
    "brush",
    "circle",
    "curved-line",
    "eraser",
    "fill-with-color",
    "free-form-select",
    "line",
    "magnifier",
    "pencil",
    "pick-color",
    "polygon",
    "rectangle",
    "rounded-rectangle",
    "select",
    "spray",
    "text",
  ];

  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFFFFF",
    "#000000",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#808080",
    "#A52A2A",
    "#DEB887",
    "#5F9EA0",
    "#7FFF00",
    "#D2691E",
    "#FF7F50",
    "#6495ED",
    "#FFF8DC",
    "#DC143C",
    "#00BFFF",
    "#1E90FF",
    "#B22222",
    "#FF4500",
  ];

  async function getCv() {
    try {
      const response = await http.get("cv");
      return response.data;
    } catch (error) {
      console.error("Error fetching menu:", error);
      return null;
    }
  }

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const data = await getCv();
        setImage(data);

        const img = new Image();
        img.src = data[0].image; // Use data.cv_image here, not image.cv_image
        img.onload = () => {
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          contextRef.current = context;

          // Set canvas dimensions to match image dimensions
          const aspectRatio = img.height / img.width;
          canvas.width = canvas.parentElement.clientWidth;
          canvas.height = canvas.width * aspectRatio;

          // Draw the image on the canvas
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchApi();
  }, []);

  const startDrawing = (event) => {
    isDrawing.current = true;
    contextRef.current.beginPath();
    contextRef.current.moveTo(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY
    );
  };

  const finishDrawing = () => {
    isDrawing.current = false;
    contextRef.current.closePath();
  };

  const draw = (event) => {
    if (!isDrawing.current) return;

    contextRef.current.lineWidth = 5; // Set line width
    contextRef.current.lineCap = "round"; // Round line cap
    contextRef.current.strokeStyle = strokeColor; // Set stroke color

    contextRef.current.lineTo(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY
    );
    contextRef.current.stroke();
  };
  const changeColor = (color) => {
    setStrokeColor(color); // Update the stroke color
  };

  return (
    <>
      <div className={styles.applicationInner}>
        <div className={styles.applicationInner__left}>
          <ul className={styles.applicationInner__leftTools}>
            {icons.map((icon, index) => (
              <li
                key={index}
                className={icon == "pencil" ? styles.active : ""} // Apply 'active' class conditionally
              >
                <img src={`./img/paint/${icon}.png`} alt={icon} />
              </li>
            ))}
          </ul>
          {image && image.length > 0 && image[0].pdf && (
            <div className={styles.applicationInner__leftTools_download}>
              <a href={image[0].pdf}>Télécharger</a>
            </div>
          )}
        </div>
        <div className={styles.applicationInner__right}>
          <div className={styles.test}>
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              className={styles.applicationInner__rightCanvas}
            />
          </div>
        </div>
      </div>
      <div className={styles.applicationBottom}>
        <div className={styles.applicationBottom__color}>
          <div className={styles.applicationBottom__colorSelected}>
            <div
              className={styles.selected}
              style={{ backgroundColor: strokeColor }}
            ></div>

            <div className={styles.unselected}></div>
          </div>
          <div className={styles.applicationBottom__colorChoice}>
            {colors.map((color, index) => (
              <div
                key={index}
                onClick={() => changeColor(color)}
                style={{
                  backgroundColor: color,
                  cursor: "pointer",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
