import { useEffect, useState } from "react";
import styles from "./webbrowser.module.scss";

export function WebBrowser({ href }) {
  return (
    <div>
      
      <iframe
        src={href}
        width="100%"
        height="500px"
        style={{ border: "none" }}
        title="Web Browser"
      />
    </div>
  );
}
