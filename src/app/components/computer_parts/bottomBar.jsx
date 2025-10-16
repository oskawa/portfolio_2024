"use client";
import Link from "next/link";
import { StartBar } from "./startBar";
import LanguageSwitcher from "./../languageSwitcher";
import { useState, useEffect } from "react";

import styles from "./BottomBar.module.scss";
export function BottomBar({
  onProjectSelect,
  onWindowSelect,
  selectedProjects,
  minimizedProjects,
  onProjectClick,
  focusProject,
  onDocumentSelect,
  menu,
  links,
  onStraight,
  lang,
  isSimplified,
}) {
  const [isStartMenuVisible, setIsStartMenuVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const toggleStartMenu = () => {
    setIsStartMenuVisible((prev) => !prev); // Toggle start menu visibility
  };
  const hideStartMenu = () => {
    setIsStartMenuVisible(false); // Toggle start menu visibility
  };

  const handleProjectSelect = (project) => {
    onProjectSelect(project); // Call the function passed from the parent
    hideStartMenu(); // Hide the start menu after project selection
  };
  const handleWindowSelect = (window) => {
    onWindowSelect(window); // Call the function passed from the parent
    hideStartMenu(); // Hide the start menu after project selection
  };
  const handleDocSelect = (project) => {
    onDocumentSelect(); // Call the function passed from the parent
    hideStartMenu(); // Hide the start menu after project selection
  };

  const handleStraightButton = () => {
    onStraight(); // Call the callback with the variable
    setIsStartMenuVisible(false);
  };

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const hours = String(date.getHours()).padStart(2, "0"); // Format hours
      const minutes = String(date.getMinutes()).padStart(2, "0"); // Format minutes
      setCurrentTime(`${hours}:${minutes}`); // Set formatted time
    };

    updateTime(); // Get the time when component mounts
    const intervalId = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div className={styles.bottomBar}>
      <div className={styles.bottomBar__left}>
        {isSimplified ? (
          <Link href={`/fr`}>
            <div
              className={`${styles.bottomBar__start} ${
                styles.bottomBar__start__width
              }`}
            >
              
              Retour au site
            </div>
          </Link>
        ) : (
          <div
            className={`
          ${styles.bottomBar__start}
          ${isStartMenuVisible ? styles.active : styles.inactive}
          `}
            onClick={toggleStartMenu}
          >
            Menu
          </div>
        )}
        <div className={styles.bottomBar__applications}>
          <div className={styles.bottomBar__applicationLinks}>
            <ul className={styles.bottomBar__applicationLinks__list}>
              {links &&
                links.map((link) => {
                  return (
                    <li key={link.link}>
                      <a href={link.link} target="_blank">
                        <img src={link.image} alt="" />
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
          {selectedProjects &&
            selectedProjects.map((project) => {
              const isActive =
                focusProject === project.slug &&
                !minimizedProjects.includes(project.slug);
              return (
                <div
                  className={`${styles.bottomBar__applicationSingle} ${
                    isActive ? styles.active : ""
                  } ${
                    minimizedProjects.includes(project.slug)
                      ? styles.minimized
                      : ""
                  }`}
                  onClick={() => {
                    onProjectClick(project.slug); // Call the function passed as prop
                    hideStartMenu(); // Directly call the hideStartMenu function here
                  }}
                >
                  <img src={project.logo} alt="" />
                  <h5>{project.title}</h5>
                </div>
              );
            })}
        </div>
      </div>
      <div className={styles.bottomBar__right}>
        <div className={styles.divider}></div>
        <div className={styles.bottomBar__rightInner}>
          <div className={styles.bottomBar__rightInnerLanguage}></div>
          <div className={styles.bottomBar__straight}>
            <button
              onClick={handleStraightButton}
              id={styles.straight}
            ></button>
          </div>
          <div className={styles.bottomBar__rightInnerHour}>
            <LanguageSwitcher />
          </div>
          <div className={styles.bottomBar__rightInnerHour}>{currentTime}</div>
        </div>
      </div>
      {isStartMenuVisible && (
        <StartBar
          menu={menu}
          onProjectSelect={handleProjectSelect}
          onDocumentSelect={handleDocSelect}
          onWindowSelect={handleWindowSelect}
          lang={lang}
        />
      )}
    </div>
  );
}
