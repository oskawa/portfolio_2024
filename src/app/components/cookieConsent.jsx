"use client";

import { useState, useEffect } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import Cookies from "js-cookie";
import styles from "./cookie.module.scss";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function CookieConsent() {
  const [cookieState, setCookieState] = useState("not-answered");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const state = Cookies.get("cookie-consent-state");
    if (state) setCookieState(state);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 6000); // 2-second delay

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  useEffect(() => {
    if (cookieState === "accepted") {
      window.trackClick = (label = "unknown_button") => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "button_click",
          button_name: label,
        });
      };
    } else {
      window.trackClick = () => {}; // No-op if no consent
    }
  }, [cookieState]);

  const handleConsent = (state) => {
    Cookies.set("cookie-consent-state", state, {
      // Set to your domain; omit for the current domain only
      domain:
        process.env.NODE_ENV === "production"
          ? "portfolio-2024-delta-beryl.vercel.app"
          : undefined,
      path: "/",
      sameSite: "Lax", // Adjust based on your needs
      secure: process.env.NODE_ENV === "production", // Secure cookies only on HTTPS
    });
    setCookieState(state);
  };

  if (cookieState === "not-answered") {
    return (
      <div
        className={`${styles.cookieConsent} ${isVisible ? styles.visible : ""}`}
      >
        <div className={styles.cookieConsentHeader}>
          <div className={styles.applicationName}>
            <img src="/img/icons/msn.png" alt="" />
            <h4>Cookies - Vous avez un nouveau message !</h4>
          </div>
        </div>
        <div className={styles.cookieConsent__inner}>
          <div className={styles.cookieConsent__img} src="" alt="">
            <img src="/img/msn.jpg" alt="" />
          </div>
          <div className={styles.cookieConsent__innerText}>
            <p>
              <span>
                Maxime<img src="/img/icons/16.png"></img> dit :
              </span>
              Kk, j'utilise des cookies, tu acceptes ?{" "}
            </p>
            <div className={styles.cookieContent__buttons}>
              <button onClick={() => handleConsent("accepted")}>
                Carrément !
              </button>
              <button onClick={() => handleConsent("rejected")}>Ignorer</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cookieState === "accepted") {
    return <GoogleTagManager gtmId={GTM_ID} />;
  }

  return (
    <button
      className="fixed bottom-4 right-4 p-2 bg-gray-200 rounded-full"
      onClick={() => setCookieState("not-answered")}
    >
      🍪
    </button>
  );
}
