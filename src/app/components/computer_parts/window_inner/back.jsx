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
    console.log(panelToShow)
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
        className={`${styles.panel} ${styles.mentions} ${
          activePanel === "mentions" ? styles.active : ""
        }`}
      >
        <div className={styles.mentionsInner}>
          <h2>Mentions</h2>
          <h3>Éditeur du site</h3>
          <p>Nom : Eloir Maxime</p>
          <p>NUMERO SIRET : 97852128400015</p>
          <p>E-mail : maxime.eloir@gmail.com</p>
          <h3>Éditeur du site</h3>
          <p>Le site est hébergé par : O2switch</p>
          <h3>Propriété intellectuelle</h3>
          <p>
            L’ensemble des contenus (textes, images, vidéos, graphiques, logo,
            etc.) présents sur ce site sont la propriété exclusive de Eloir
            Maxime, sauf mention contraire.
          </p>
          <p>
            Toute reproduction, distribution, modification ou utilisation sans
            autorisation préalable est interdite et peut faire l’objet de
            poursuites. Sauf si ça me fait rire.
          </p>
          <h3>Données personnelles</h3>
          <p>
            Les données personnelles collectées via le formulaire de contact
            (nom, email, message) sont uniquement destinées à Eloir Maxime pour
            répondre aux demandes des visiteurs. Elles ne sont ni cédées, ni
            revendues à des tiers. Conformément au Règlement Général sur la
            Protection des Données (RGPD), vous disposez d’un droit d’accès, de
            rectification et de suppression de vos données personnelles en
            contactant maxime.eloir@gmail.com.
          </p>
          <h3>Cookies</h3>
          <p>
            Ce site utilise des cookies pour améliorer l’expérience utilisateur
            et réaliser des statistiques de visites. Vous pouvez configurer
            votre navigateur pour bloquer ces cookies ou les accepter selon vos
            préférences.
          </p>
          <h3>Responsabilité</h3>
          <p>
            [Ton Nom] ne saurait être tenu responsable des erreurs ou omissions
            présentes sur le site, ni des dommages directs ou indirects pouvant
            résulter de son utilisation. Les liens externes présents sur ce site
            ne relèvent pas de la responsabilité de l'éditeur.
          </p>
          <h3>Contact</h3>
          <p>
            Pour toute question ou demande d'information concernant ces mentions
            légales, vous pouvez contacter maxime.eloir@agenceseize.fr.
          </p>
        </div>
      </div>
      {activePanel === "back" && (
        <div className={styles.applicationInnerBottom}>
          <button onClick={() => handleButtonApply("ok")}>Ok</button>
          <button onClick={() => handleButtonApply("close")}>Annuler</button>
          <button
            onClick={() => handleButtonApply("apply")}
            className={isButtonActive ? "" : styles.inactive}
          >
            Appliquer
          </button>
        </div>
      )}
    </div>
  );
}
