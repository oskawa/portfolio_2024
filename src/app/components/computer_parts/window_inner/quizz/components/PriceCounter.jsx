import React from "react";
import styles from "../../quizz.module.scss";
import { questionsPrice } from "../utils/quizMessages";

export const PriceCounter = ({ currentIndex }) => {
  return (
    <>
      {questionsPrice.map((price, index) => (
        <div
          key={index}
          className={`${styles.priceItem} ${
            currentIndex === index ? styles.active : ""
          }`}
        >
          <span>
            Question {index + 1} : {price}€
          </span>
        </div>
      ))}
    </>
  );
};
