// components/ClickTracker.js
"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";

export default function ClickTracker() {
  useEffect(() => {
    const consent = Cookies.get("cookie-consent-state");

    if (consent === "accepted") {
      const handleClick = (e) => {
        const target = e.target.closest(".trackable");

        if (target) {
          const label = target.getAttribute("data-gtm-label") || "unknown";
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "button_click",
            button_name: label,
          });
        }
      };

      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, []);

  return null; // Pas de rendu visible
}
