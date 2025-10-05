import http from "../../../axios/http";
import styles from "./word.module.scss";
import LayoutsFactory from "../../layoutsFactory";

import { useRef, useEffect, useState } from "react";
export function WordWindows({ onBackgroundChange, onClose }) {
  const [pro, setPro] = useState([]);

  async function getPro() {
    try {
      const response = await http.get("pro");
      return response.data;
    } catch (error) {
      console.error("Error fetching menu:", error);
      return null;
    }
  }
  useEffect(() => {
    const fetchPro = async () => {
      try {
        const data = await getPro();
        setPro(data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPro();
  }, []);

  return (
    <div className={styles.applicationInner}>
      <div className={styles.applicationContent}>
        <div className={styles.applicationInnerContent}>
          <h2>Travaillons ensemble ! </h2>
          {pro?.repeatable_content?.map((layout, index) => (
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
