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

export function StartBar({ onProjectSelect, projects, onDocumentSelect }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchMenu = async () => {
      const data = await getMenu();
      setMenu(data);
      setLoading(false);
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    if (menu) {
      console.log(menu);
    }
  }, [menu]); // This useEffect will trigger every time `menu` is updated

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
          {menu.projects && (
            <div className={styles.startMenu__innerSingle}>
              <div className={styles.startMenu__innerSingle__title}>
                <img src="path/to/icon.png" alt="" />
                <h2>Les projets</h2>
              </div>
              {/* Iterate through the project taxonomies */}
              <div className={styles.startSubmenu__inner}>
                {menu.projects.map((taxonomyItem, taxonomyIndex) => (
                  <div
                    key={taxonomyIndex}
                    className={styles.startSubmenu__innerSingle}
                  >
                    <div className={styles.startSubmenu__innerSingle__title}>
                      <img src="path/to/taxonomy-icon.png" alt="" />
                      <h3 className={styles.startSubmenu__cat}>
                        {taxonomyItem.taxonomy}
                      </h3>
                    </div>

                    {/* Render the child taxonomies and their projects */}
                    {taxonomyItem.children && (
                      <div className={styles.startSubmenu__inner}>
                        {taxonomyItem.children.map((child, childIndex) => (
                          <div
                            key={childIndex}
                            className={styles.startSubmenu__innerSingle}
                          >
                            <div
                              className={
                                styles.startSubmenu__innerSingle__title
                              }
                            >
                              <img src="" alt="" />
                              <h4>{child.taxonomy}</h4>
                            </div>

                            {/* Render the list of projects for each child taxonomy */}
                            {child.projects && (
                              <div className={styles.startSubmenu__inner}>
                                {child.projects.map((project, projectIndex) => (
                                  <div
                                    key={projectIndex} // Add a key here for the project div
                                    className={
                                      styles.startSubmenu__innerSingle__title
                                    }
                                    style={{ cursor: "pointer" }}
                                    onClick={() => onProjectSelect(project)}
                                  >
                                    <img src={""} alt={""} />
                                    <h5>{project.title}</h5>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render the projects directly under the taxonomy (if any) */}
                    {taxonomyItem.projects && (
                      <div className={styles.startSubmenu__inner}>
                        {taxonomyItem.projects.map((project, projectIndex) => (
                          <div
                            key={projectIndex}
                            style={{ cursor: "pointer" }}
                            className={styles.startSubmenu__innerSingle__title}
                            onClick={() => onProjectSelect(project)}
                          >
                            <img
                              src={project.logo || "default-logo.png"}
                              alt=""
                            />
                            <h5>{project.title}</h5>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {menu.CV && (
            <div className={styles.startMenu__innerSingle}
            onClick={onDocumentSelect}>
              <div className={styles.startMenu__innerSingle__title}>
                <img src="path/to/icon.png" alt="" />
                <h2>{menu.CV.title}</h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
