import { useRef, useEffect, useState } from "react";
import styles from "./PaintWindow.module.scss";
export function PaintWindow({isFocus, onClick, isMinimized, onMinimize, onClose}) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const imageSrc = "img/cv.jpg"; // Path to your image
  const [image, setImage] = useState(null);
 
  const [strokeColor, setStrokeColor] = useState("red"); // Default color
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [upscale, setUpscale] = useState(false);
  const [mini, setMini] = useState(false);
  
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

  useEffect(() => {
    console.log('coucou')
    console.log(document.getElementById('application-cv'))
    console.log(loading)
    if (loading) return;
    const elmnt = document.getElementById('application-cv');
    if (!elmnt) return; // Exit if the element doesn't exist
    const header = document.getElementById('applicationheader-cv');
    console.log(header);
    const dragMouseDown = (e) => {
      e.preventDefault();
      let pos3 = e.clientX;
      let pos4 = e.clientY;

      const elementDrag = (e) => {
        e.preventDefault();
        const pos1 = pos3 - e.clientX;
        const pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      };

      const closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };

      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    if (header) {
      header.onmousedown = dragMouseDown; // Bind drag function to header
    } else {
      elmnt.onmousedown = dragMouseDown; // Bind drag function to the element itself
    }

    return () => {
      // Cleanup function to remove event listeners
      if (header) {
        header.onmousedown = null;
      } else {
        elmnt.onmousedown = null;
      }
    };
  }, [loading]);

  const changeColor = (color) => {
    setStrokeColor(color); // Update the stroke color
  };
  const handleUpscale = () => {
    setUpscale(!upscale);
    setMini(false); // Ensure the window is not minimized when upscaled
  };
  const handleMini = () => {
    onMinimize(); // Call the minimize function from parent
  };
  useEffect(() => {
    // Apply the minimized state based on the prop
    setMini(isMinimized);
  }, [isMinimized]);

  return (
    <div
      className={`${styles.application} ${
        upscale ? styles.upscale : styles.inactive
      } ${isFocus ? styles.focus : styles.unfocus}
      ${isMinimized ? styles.mini : styles.unmini}
      `}
      id={`application-cv`}
      onClick={onClick}
    >
      <div className={styles.applicationTop} id={`applicationheader-cv`}
        draggable="true">
        <div className={styles.applicationName}>
          <img src="" alt="" />
          <h4>Paint</h4>
        </div>
        <div className={styles.applicationButtons}>
          <button
            className={`${styles.applicationButtons__inner} ${styles.applicationButtons__mini}`}
            onClick={handleMini}
          ></button>
          <button
            className={`${styles.applicationButtons__inner} ${styles.applicationButtons__upscale}`}
            onClick={() => handleUpscale()}
          ></button>
          <button
            className={`${styles.applicationButtons__inner} ${styles.applicationButtons__close}`}
            onClick={onClose}
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