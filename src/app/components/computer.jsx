"use client";
import { useState, useEffect } from "react";
import http from "./../axios/http";
import { BottomBar } from "./computer_parts/bottomBar";
import { WindowProject } from "./computer_parts/windowProject";
import { PaintWindow } from "./computer_parts/paintWindow";
import { ContactForm } from "./computer_parts/contact";
import { Loader } from "./loader";
import { translate } from "../../utils/translate";
import CookieConsent from "./cookieConsent";
import ClickTracker from "./ClickTracker";

import styles from "./Computer.module.scss";

export function Computer({ lang }) {
  const [selectedProjects, setSelectedProjects] = useState([]); // Track the selected project
  const [focusWindow, setFocusWindow] = useState(null); // Track the active window
  const [document, setDocument] = useState(false); // Track the active window
  const [minimizedProjects, setMinimizedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState([]);
  const [links, setLinks] = useState([]);
  const [straight, setStraight] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");

  const handleStraight = () => {
    setStraight(!straight);
  };
  useEffect(() => {
    // Fetch content or initialize state if needed
  }, [lang]);

  const handleProjectSelect = (project) => {
    if (!selectedProjects.find((p) => p.slug === project.slug)) {
      setSelectedProjects([...selectedProjects, project]); // Add project to selected projects
    }
    setFocusWindow(project.slug); // Set focus to the selected project
  };
  const handleWindowSelect = (name) => {
    if (!selectedProjects.find((p) => p.slug === name.slug)) {
      setSelectedProjects([...selectedProjects, name]); // Add project to selected projects
    }
    setFocusWindow(name.slug); // Set focus to the selected project
  };

  const handleFocusWindow = (slug) => {
    setFocusWindow(slug); // Set the active window
  };
  const handleDocument = () => {
    setDocument(true); // Set the active window
  };

  const handleCloseWindow = (slug) => {
    setSelectedProjects(selectedProjects.filter((p) => p.slug !== slug)); // Remove project from selected projects
  };

  const handleMinimizeWindow = (slug) => {
    const isMinimized = minimizedProjects.includes(slug);
    if (!isMinimized) {
      setMinimizedProjects([...minimizedProjects, slug]); // Add to minimized
    } else {
      setMinimizedProjects(minimizedProjects.filter((p) => p !== slug)); // Remove from minimized
    }
  };

  const handleClickBottomBarProject = (slug) => {
    setFocusWindow(slug); // Set as active when clicked from BottomBar
    setMinimizedProjects(minimizedProjects.filter((p) => p !== slug)); // Restore if minimized
  };

  const handleBackgroundChange = (url) => {
    setBackgroundImage(url);
  };

  async function getMenu() {
    try {
      const response = await http.get("menu");
      return response.data;
    } catch (error) {
      console.error("Error fetching menu:", error);
      return null;
    }
  }
  async function getLinks() {
    try {
      const response = await http.get("options-link");
      return response.data;
    } catch (error) {
      console.error("Error fetching menu:", error);
      return null;
    }
  }

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const data = await getMenu();
        const linksData = await getLinks();
        setMenu(data);
        setLinks(linksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Add a 2-second delay before stopping the loader
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10; // Increment progress
          });
        }, 100); // Increment every 100 ms

        // After 2 seconds, set loading to false
        setTimeout(() => {
          clearInterval(interval); // Clear the interval when loading is finished
          setLoading(false);
        }, 2000); // 2 seconds delay
      }
    };
    fetchApi();
  }, []);

  return (
    <div className={styles.innerBack}>
      <div className={`${styles.inner} ${straight ? styles.straight : ""}`}>
        {loading && <Loader progress={progress} />}
        {!loading && <CookieConsent />}
        <ClickTracker />
        <div
          className={styles.desktop}
          style={{ backgroundImage: backgroundImage, backgroundSize: "cover" }}
        >
          <div className={styles.line}></div>
          <div className={styles.scanline}></div>
          <button
            className={`${styles.trackable} trackable`}
            data-gtm-label="screen_back"
            onClick={() =>
              handleWindowSelect({
                type: "windowClassic",
                title: "Fond d'écran",
                slug: "back",
                logo: "/img/icons/cv.png",
              })
            }
          >
            <img src="/img/icons/back.png" alt="" />
            <span>{translate("personnalisation", lang)}</span>
          </button>
          <button
            onClick={() =>
              handleWindowSelect({
                type: "windowClassic",
                title: "Music Player",
                slug: "music",
                logo: "/img/icons/music.png",
              })
            }
          >
            <img src="/img/icons/music.png" alt="" />
            <span>Music Player</span>
          </button>
          <button
            onClick={() =>
              handleWindowSelect({
                type: "windowClassic",
                title: "Travaillons ensemble",
                slug: "work",
                logo: "/img/icons/work.png",
              })
            }
          >
            <img src="/img/icons/work.png" alt="" />
            <span>{translate("Travaillons_ensemble.doc", lang)}</span>
          </button>
          {/* <button
            onClick={() =>
              handleWindowSelect({
                type: "windowClassic",
                title: "Plateformer",
                slug: "2dplaterformer",
                logo: "/img/icons/work.png",
              })
            }
          >
            <img src="/img/icons/work.png" alt="" />
            <span>{translate("Platerformer", lang)}</span>
          </button> */}
          <button
            onClick={() =>
              handleWindowSelect({
                type: "windowClassic",
                title: "Card Game",
                slug: "cardgame",
                logo: "/img/icons/card.png",
              })
            }
          >
            <img src="/img/icons/card.png" alt="" />
            <span>{translate("CardGame.exe", lang)}</span>
          </button>
          <button
            onClick={() =>
              handleWindowSelect({
                type: "windowClassic",
                title: "Platerformer",
                slug: "plateformer",
                logo: "/img/icons/plateformer.png",
              })
            }
          >
            <img src="/img/icons/plateformer.png" alt="" />
            <span>{translate("Plateformer", lang)}</span>
          </button>
          
          {/* <button
            onClick={() =>
              handleWindowSelect({
                type: "windowClassic",
                title: "Futball",
                slug: "futball",
                logo: "/img/icons/plateformer.png",
              })
            }
          >
            <img src="/img/icons/futbal.png" alt="" />
            <span>{translate("Futball", lang)}</span>
          </button> */}

        </div>

        <BottomBar
          onProjectSelect={handleProjectSelect}
          onWindowSelect={handleWindowSelect}
          selectedProjects={selectedProjects}
          minimizedProjects={minimizedProjects}
          onProjectClick={handleClickBottomBarProject}
          focusProject={focusWindow}
          onDocumentSelect={handleDocument}
          menu={menu}
          links={links}
          onStraight={handleStraight}
          lang={lang}
        />

        {selectedProjects &&
          selectedProjects.map((project) => {
            // Check if project.slug is "contact"
            if (project.type == "windowClassic") {
              return (
                <div key={project.slug}>
                  <PaintWindow
                    data={project}
                    onClick={() => handleFocusWindow(project.slug)} // Handle click to activate
                    onClose={() => handleCloseWindow(project.slug)}
                    isFocus={focusWindow === project.slug}
                    isMinimized={minimizedProjects.includes(project.slug)}
                    onMinimize={() => handleMinimizeWindow(project.slug)}
                    onBackgroundChange={(data) => handleBackgroundChange(data)}
                  />
                </div>
              );
            }
            if (project.type == "windowContact") {
              return (
                <div key={project.slug}>
                  <ContactForm
                    onClick={() => handleFocusWindow(project.slug)} // Handle click to activate
                    onMinimize={() => handleMinimizeWindow(project.slug)}
                    onClose={() => handleCloseWindow(project.slug)}
                    isFocus={focusWindow === project.slug}
                    isMinimized={minimizedProjects.includes(project.slug)}
                  />
                </div>
              );
            }
            if (project.type == "windowMusic") {
            }

            // Default rendering for other projects
            return (
              <div key={project.slug}>
                <WindowProject
                  data={project.slug}
                  onClose={() => handleCloseWindow(project.slug)}
                  isFocus={focusWindow === project.slug}
                  onClick={() => handleFocusWindow(project.slug)}
                  isMinimized={minimizedProjects.includes(project.slug)}
                  onMinimize={() => handleMinimizeWindow(project.slug)}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
