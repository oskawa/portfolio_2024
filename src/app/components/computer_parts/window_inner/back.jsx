import http from "./../../../axios/http";
import styles from "./back.module.scss";

import { useRef, useEffect, useState } from "react";
export function BackWindow({ onBackgroundChange, onClose }) {
  const [activeButton, setActiveButton] = useState("none"); // Default active button
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(false); // State for Apply button

  const [activePanel, setActivePanel] = useState("back"); // Default panel

  const backgroundImages = {
    none: "url(/img/back/screensavers/none.jpg)", // Replace with actual image path
    clouds: "url(/img/back/screensavers/clouds.jpg)",
    gameoflife: "url(/img/back/screensavers/gameoflife.jpg)",
    italie: "url(/img/back/screensavers/italie.jpg)",
    album: "url(/img/back/screensavers/album.jpg)",
  };

  const handlePanelClick = (event) => {
    const panelToShow = event.currentTarget.getAttribute("data-attr");
    setActivePanel(panelToShow);
  };

  const handleButtonClick = (event) => {
    const newActive = event.currentTarget.getAttribute("data-value"); // Retrieve data-attribute
    setActiveButton(newActive); // Update the active button
    setBackgroundImage(backgroundImages[newActive]);
  };
  const handleButtonApply = (action = null) => {
    if (action === "apply") {
      onBackgroundChange(backgroundImage); // Call the function to change the background
    }
    if (action === "ok") {
      onBackgroundChange(backgroundImage); // Call the function to change the background
      onClose();
    }
    if (action === "close") {
      onClose();
    }
  };

  useEffect(() => {
    if (backgroundImage) {
      setIsButtonActive(true); // Remove the inactive class
    }
  }, [backgroundImage]); // Run this effect whenever backgroundImage changes

  return (
    <div className={styles.applicationInner}>
      <button
        data-attr="back"
        className={`${styles.applicationButtons} ${
          activePanel === "back" ? styles.active : ""
        }`}
        onClick={handlePanelClick}
      >
        Background
      </button>
      <button
        data-attr="mentions"
        className={`${styles.applicationButtons} ${
          activePanel === "mentions" ? styles.active : ""
        }`}
        onClick={handlePanelClick}
      >
        Mentions
      </button>
      <div
        data-panel="back"
        className={`${styles.panel} ${
          activePanel === "back" ? styles.active : ""
        }`}
      >
        <div className={styles.panelScreen}>
          <img src="/img/back/screen.png" alt="" />
          <div
            className={styles.panelScreenBackgroundChange}
            style={{
              backgroundImage: backgroundImage,
              backgroundSize: "cover",
            }}
          ></div>
        </div>
        <div className={styles.panelScreenChoice}>
          <p className={styles.panelScreenChoiceTitle}>Walpaper</p>
          <p className={styles.panelScreenChoiceParagraph}>
            Select an HTML Document or a picture :
          </p>
          <div className={styles.applicationsBackground}>
            <button
              className={activeButton === "none" ? styles.active : ""}
              onClick={handleButtonClick}
              data-value="none"
            >
              None
            </button>
            <button
              className={activeButton === "clouds" ? styles.active : ""}
              onClick={handleButtonClick}
              data-value="clouds"
            >
              Clouds
            </button>
            <button
              className={activeButton === "gameoflife" ? styles.active : ""}
              onClick={handleButtonClick}
              data-value="gameoflife"
            >
              Game of life
            </button>
            <button
              className={activeButton === "italie" ? styles.active : ""}
              onClick={handleButtonClick}
              data-value="italie"
            >
              Italie
            </button>
            <button
              className={activeButton === "album" ? styles.active : ""}
              onClick={handleButtonClick}
              data-value="album"
            >
              Futuriste
            </button>
          </div>
        </div>
      </div>
      <div
        data-panel="mentions"
        className={`${styles.panel} ${
          activePanel === "mentions" ? styles.active : ""
        }`}
      >
        <h2>Mentions</h2>

      </div>
      <div className={styles.applicationInnerBottom}>
        <button onClick={() => handleButtonApply("ok")}>Ok</button>
        <button onClick={() => handleButtonApply("close")}>Cancel</button>
        <button
          onClick={() => handleButtonApply("apply")}
          className={isButtonActive ? "" : styles.inactive}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
