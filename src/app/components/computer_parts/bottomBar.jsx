import Link from "next/link";
import { StartBar } from "./startBar";
import { useState, useEffect } from "react";
import styles from "./BottomBar.module.scss";
export function BottomBar({
  onProjectSelect,
  selectedProjects,
  minimizedProjects,
  onProjectClick,
  focusProject,
  onDocumentSelect,
  menu,
  links,
  onStraight
}) {
  const [isStartMenuVisible, setIsStartMenuVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const toggleStartMenu = () => {
    setIsStartMenuVisible((prev) => !prev); // Toggle start menu visibility
  };

  const handleStraightButton = () => {
    onStraight(); // Call the callback with the variable
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
        <div
          className={`
          ${styles.bottomBar__start}
          ${isStartMenuVisible ? styles.active : styles.inactive}
          `}
          onClick={toggleStartMenu}
        >
          Menu
        </div>
        <div className={styles.bottomBar__applications}>
          <div className={styles.bottomBar__applicationLinks}>
            <ul className={styles.bottomBar__applicationLinks__list}>
              {links &&
                links.map((link) => {
                  return (
                    <li key={link.link}>
                        <a target="_blank" href={link.link}>
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
                  onClick={() => onProjectClick(project.slug)}
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
          <div className={styles.bottomBar__straight}><button onClick={handleStraightButton} id={styles.straight}></button></div>
          <div className={styles.bottomBar__rightInnerHour}>{currentTime}</div>
        </div>
      </div>
      {isStartMenuVisible && (
        <StartBar
          menu={menu}
          onProjectSelect={onProjectSelect}
          onDocumentSelect={onDocumentSelect}
        />
      )}
    </div>
  );
}
