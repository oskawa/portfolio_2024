import { useRef, useEffect, useState } from "react";
import { CvWindow } from "./window_inner/cv";
import { RubiksWindow } from "./window_inner/rubiks";
import { ConnectWindows } from "./window_inner/connect";
import { BackWindow } from "./window_inner/back";
import { PicrossWindow } from "./window_inner/picross";
import { CardWindow } from "./window_inner/cardgame";
import { MinesweeperWindow } from "./window_inner/minesweeper";
import { VirtualVisitWindow } from "./window_inner/virtualvisit";
import { TetrisWindow } from "./window_inner/tetris";
import { MusicWindow } from "./window_inner/music";
import { WebBrowser } from "./window_inner/webbrowser";
import { WordWindows } from "./window_inner/word";
import styles from "./PaintWindow.module.scss";
import http from "./../../axios/http";

export function PaintWindow({
  data,
  isFocus,
  onClick,
  isMinimized,
  onMinimize,
  onClose,
  onBackgroundChange,
}) {
  const [loading, setLoading] = useState(false);
  const [upscale, setUpscale] = useState(false);
  const [mini, setMini] = useState(false);
  const [backgroundData, setBackgroundData] = useState(null);

  const handleBackgroundChange = (data) => {
    setBackgroundData(data);
    onBackgroundChange(data);
  };

  useEffect(() => {
    if (loading) return;
    const elmnt = document.getElementById(`application-${data.slug}`);
    if (!elmnt) return; // Exit if the element doesn't exist
    const header = document.getElementById(`applicationheader-${data.slug}`);

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
      ${data.slug == "back" ? styles.small : ""}
      ${data.slug == "music" ? styles.smallMini : ""}
      ${data.slug == "picross" ? styles.auto : ""}
      ${data.slug == "minesweeper" ? styles.auto : ""}
      `}
      id={`application-${data.slug}`}
      onClick={onClick}
    >
      <div
        className={styles.applicationTop}
        id={`applicationheader-${data.slug}`}
        draggable="true"
      >
        <div className={styles.applicationName}>
          <img src={`/img/icons/${data.slug}.png`} alt="" />
          <h4>{data.title}</h4>
        </div>
        <div className={styles.applicationButtons}>
          <button
            className={`${styles.applicationButtons__inner} ${styles.applicationButtons__mini}`}
            onClick={handleMini}
          ></button>
          {data.slug !== "back" &&
            data.slug !== "music" &&
            data.slug !== "picross" && (
              <button
                className={`${styles.applicationButtons__inner} ${styles.applicationButtons__upscale}`}
                onClick={() => handleUpscale()}
              ></button>
            )}
          <button
            className={`${styles.applicationButtons__inner} ${styles.applicationButtons__close}`}
            onClick={onClose}
          ></button>
        </div>
      </div>

      {data.slug == "cv" ? (
        <CvWindow />
      ) : data.slug == "rubiks" ? (
        <RubiksWindow />
      ) : data.slug == "connect" ? (
        <ConnectWindows />
      ) : data.slug == "picross" ? (
        <PicrossWindow />
      ) : data.slug == "minesweeper" ? (
        <MinesweeperWindow />
      ) : data.slug == "virtualvisit" ? (
        <VirtualVisitWindow />
      ) : data.slug == "music" ? (
        <MusicWindow />
      ) : data.slug == "tetris" ? (
        <TetrisWindow />
      ) : data.slug == "cardgame" ? (
        <CardWindow />
      ) : data.slug == "back" ? (
        <BackWindow
          onBackgroundChange={handleBackgroundChange}
          onClose={onClose}
        />
      ) : data.slug == "webbrowser" ? (
        <WebBrowser href={data.href} />
      ) : data.slug == "work" ? (
        <WordWindows href={data.href} />
      ) : (
        <BackWindow />
      )}
    </div>
  );
}
