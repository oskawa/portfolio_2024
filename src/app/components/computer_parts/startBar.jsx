"use client";
import React, { useState, useEffect } from "react";
import http from "./../../axios/http";
import styles from "./StartBar.module.scss";
import { WindowProject } from "./windowProject";

// Fetch menu data
async function getMenu() {
  try {
    const response = await http.get("menu");
    return response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return null;
  }
}

export function StartBar({ onProjectSelect, projects }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchMenu = async () => {
      const data = await getMenu();
      if (data && Array.isArray(data)) {
        setMenu(data);
      } else if (data && typeof data === "object") {
        // If data is an object with numerical keys, convert it to an array
        const menuArray = Object.values(data).filter(
          (item) => typeof item === "object"
        );

        setMenu(menuArray);
      } else {
        setError("Menu data is not in the expected format.");
      }
      setLoading(false);
    };

    fetchMenu();
  }, []);

  if (loading) {
    return "";
  }

  if (error) {
    return <div className="startMenu">Error: {error}</div>;
  }

  return (
    <>
      <div className={styles.startMenu} id="start-menu">
        <div className={styles.startMenu__logo}>
          <img src="logo_white.svg" alt="" />
        </div>
        <div className={styles.startMenu__inner}>
          {menu.map((menuItem, index) => (
            <div key={index} className={styles.startMenu__innerSingle}>
              {/* Render Projects Section */}
              {menuItem.title === "Les projets" && (
                <>
                  <div className={styles.startMenu__innerSingle__title}>
                    <img src={menuItem.title} alt="" />
                    <h2>{menuItem.title}</h2>
                  </div>

                  <div className={styles.startSubmenu__inner}>
                    {Object.values(menuItem)[0].children.map(
                      (child, childIndex) => (
                        <div
                          key={childIndex}
                          className={styles.startSubmenu__innerSingle}
                        >
                          <div
                            className={styles.startSubmenu__innerSingle__title}
                          >
                            <img src="" alt="" />
                            <h3 className={styles.startSubmenu__cat}>
                              {child.taxonomy}
                            </h3>
                          </div>
                          {/* Render list of projects */}
                          {child.projects.map((project, projectIndex) => (
                            <div
                              style={{ cursor: "pointer" }}
                              key={projectIndex}
                              className={styles.startSubmenu__inner}
                              onClick={() => onProjectSelect(project)}
                            >
                              <div>
                                <div
                                  className={
                                    styles.startSubmenu__innerSingle__title
                                  }
                                >
                                  <img src={project.logo} alt="" />
                                  <h4>{project.title}</h4>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </>
              )}

              {/* Render CV Section */}
              {menuItem.title === "CV" && (
                <div className={styles.startMenu__innerSingle__title}>
                  <img src={menuItem.title} alt="" />
                  <h2>{menuItem.title}</h2>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
