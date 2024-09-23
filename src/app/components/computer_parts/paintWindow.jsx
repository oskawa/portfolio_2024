import { useRef, useEffect, useState } from "react";
import styles from "./PaintWindow.module.scss";
export function PaintWindow() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const imageSrc = "img/cv.jpg"; // Path to your image
  const [image, setImage] = useState(null);
  const [strokeColor, setStrokeColor] = useState("red"); // Default color

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

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImage(img);
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
  }, [imageSrc]);

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
    <div className={styles.application}>
      <div className={styles.applicationTop}>
        <div className={styles.applicationName}>
          <img src="" alt="" />
          <h4>Paint</h4>
        </div>
        <div className={styles.applicationButtons}>
          <button
            className={`${styles.applicationButtons__inner} ${styles.applicationButtons__mini}`}
          ></button>
          <button
            className={`${styles.applicationButtons__inner} ${styles.applicationButtons__upscale}`}
          ></button>
          <button
            className={`${styles.applicationButtons__inner} ${styles.applicationButtons__close}`}
          ></button>
        </div>
      </div>
      <div className={styles.applicationInner}>
        <div className={styles.applicationInner__left}>
          <ul className={styles.applicationInner__leftTools}>
            <li></li>
            <li></li>
          </ul>
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
            <div className={styles.selected}></div>
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
    </div>
  );
}
