import styles from "./WindowProject.module.scss";
import React, { useState, useEffect } from "react";
import http from "./../../axios/http";
import LayoutsFactory from "../layoutsFactory";

async function getPortfolioDetails(slug) {
  try {
    const response = await http.get(`portfolio/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return null;
  }
}

export function WindowProject({ data, onClose, isFocus, onClick }) {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upscale, setUpscale] = useState(false);
  const [mini, setMini] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      const detailsAsync = await getPortfolioDetails(data);

      setDetails(detailsAsync);
      setLoading(false);
    };
    fetchDetails();
  }, []);
  useEffect(() => {
    if (loading || !details.title) return;
   
    const elmnt = document.getElementById(`application-${data}`);
  
    if (!elmnt) return; // Exit if the element doesn't exist

    const header = document.getElementById(`applicationheader-${data}`);
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
  }, [data, loading, details]);
  if (loading) {
    return "";
  }

  const handleUpscale = () => {
    setUpscale((prevUpscale) => !prevUpscale); // Toggle the upscale state
  };
  const handleMini = () => {
    setMini((prevMini) => !prevMini); // Toggle the upscale state
  };

  return (
    <div
      className={`${styles.application} ${
        upscale ? styles.upscale : styles.inactive
      } ${isFocus ? styles.focus : styles.unfocus}
      ${
        mini ? styles.mini : styles.inactive
      } 
      `}
      id={`application-${data}`}
      onClick={onClick}
    >
      <div
        className={styles.applicationTop}
        id={`applicationheader-${data}`}
        draggable="true"
      >
        <div className={styles.applicationName}>
          <img src={details.logo} alt="" />
          <h4>{details.title}</h4>
        </div>
        <div className={styles.applicationButtons}>
          <button
            className={`${styles.applicationButtons__inner} ${styles.applicationButtons__mini}`}
            onClick={()=>handleMini()}
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
        <h5>{details.title}</h5>
        <h6>{details.subtitle}</h6>
        <div className={styles.applicationInnerContent}>
          {details.repeatable_content.map((layout, index) => (
            <LayoutsFactory
              key={index}
              name={layout.acf_fc_layout}
              {...layout}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
