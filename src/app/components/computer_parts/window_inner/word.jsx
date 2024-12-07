import http from "../../../axios/http";
import styles from "./word.module.scss";

import { useRef, useEffect, useState } from "react";
export function WordWindows({ onBackgroundChange, onClose }) {
  const [activeButton, setActiveButton] = useState("none"); // Default active button
  const [isButtonActive, setIsButtonActive] = useState(false); // State for Apply button

  const [activePanel, setActivePanel] = useState("back"); // Default panel


  const handlePanelClick = (event) => {
    const panelToShow = event.currentTarget.getAttribute("data-attr");
    setActivePanel(panelToShow);
  };






  return (
    <div className={styles.applicationInner}>
      <div className={styles.applicationContent}>
        <div className={styles.applicationInnerContent}>
          <p>


            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum harum quisquam ratione pariatur obcaecati fugit molestiae corrupti quo officia? Impedit, nemo odit libero asperiores quas non sit minus inventore reprehenderit?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum harum quisquam ratione pariatur obcaecati fugit molestiae corrupti quo officia? Impedit, nemo odit libero asperiores quas non sit minus inventore reprehenderit?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum harum quisquam ratione pariatur obcaecati fugit molestiae corrupti quo officia? Impedit, nemo odit libero asperiores quas non sit minus inventore reprehenderit?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum harum quisquam ratione pariatur obcaecati fugit molestiae corrupti quo officia? Impedit, nemo odit libero asperiores quas non sit minus inventore reprehenderit?
            <br />
            <br />
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum harum quisquam ratione pariatur obcaecati fugit molestiae corrupti quo officia? Impedit, nemo odit libero asperiores quas non sit minus inventore reprehenderit?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum harum quisquam ratione pariatur obcaecati fugit molestiae corrupti quo officia? Impedit, nemo odit libero asperiores quas non sit minus inventore reprehenderit?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum harum quisquam ratione pariatur obcaecati fugit molestiae corrupti quo officia? Impedit, nemo odit libero asperiores quas non sit minus inventore reprehenderit?
            <br />
            <br />
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum harum quisquam ratione pariatur obcaecati fugit molestiae corrupti quo officia? Impedit, nemo odit libero asperiores quas non sit minus inventore reprehenderit?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum harum quisquam ratione pariatur obcaecati fugit molestiae corrupti quo officia? Impedit, nemo odit libero asperiores quas non sit minus inventore reprehenderit?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum harum quisquam ratione pariatur obcaecati fugit molestiae corrupti quo officia? Impedit, nemo odit libero asperiores quas non sit minus inventore reprehenderit?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum harum quisquam ratione pariatur obcaecati fugit molestiae corrupti quo officia? Impedit, nemo odit libero asperiores quas non sit minus inventore reprehenderit?
          </p>
        </div>
      </div>
    </div>
  );
}
