"use client";
import React, { useState, useEffect } from "react";
import http from "./../../axios/http";
import styles from "./StartBar.module.scss";
import { WindowProject } from "./windowProject";
import { translate } from "../../../utils/translate";
// Fetch menu data

export function StartBar({
  onProjectSelect,
  projects,
  onDocumentSelect,
  onWindowSelect,
  menu,
  lang,
}) {
  const [error, setError] = useState(null);

  const [content, setContent] = useState(null);
  useEffect(() => {
    // Fetch content or initialize state if needed
  }, [lang]);

  if (error) {
    return <div className="startMenu">Error: {error}</div>;
  }

  return (
    <>
      <div className={styles.startMenu} id="start-menu">
        <div className={styles.startMenu__logo}>
          <img src="/img/logo_white.png" alt="" />
        </div>
        <div className={styles.startMenu__inner}>
          {menu.projects && (
            <div className={styles.startMenu__innerSingle}>
              <div className={styles.startMenu__innerSingle__title}>
                <img src="/img/icons/projects.png" alt="" />
                <h2>{translate("projects", lang)}</h2>
              </div>
              {/* Iterate through the project taxonomies */}
              <div className={styles.startSubmenu__inner}>
                {menu.projects.map((taxonomyItem, taxonomyIndex) => (
                  <div
                    key={taxonomyIndex}
                    className={styles.startSubmenu__innerSingle}
                  >
                    <div className={styles.startSubmenu__innerSingle__title}>
                      <img src={taxonomyItem.logo} alt="" />
                      <h3 className={styles.startSubmenu__cat}>
                        {taxonomyItem.taxonomy}
                      </h3>
                    </div>

                    {/* Render the child taxonomies and their projects */}
                    {taxonomyItem.children && (
                      <div className={styles.startSubmenu__innerSubSubSub}>
                        {taxonomyItem.children.map((child, childIndex) => (
                          <div
                            key={childIndex}
                            className={
                              styles.startSubmenu__innerSingleSubSubSub
                            }
                          >
                            <div
                              className={
                                styles.startSubmenu__innerSingle__title
                              }
                            >
                              <img src={child.logo} alt="" />
                              <h4>{child.taxonomy}</h4>
                            </div>

                            {/* Render the list of projects for each child taxonomy */}
                            {child.projects && (
                              <div className={styles.startSubmenu__innerSubSub}>
                                {child.projects.map((project, projectIndex) => (
                                  <div
                                    key={projectIndex} // Add a key here for the project div
                                    className={
                                      styles.startSubmenu__innerSingle__title
                                    }
                                    style={{ cursor: "pointer" }}
                                    onClick={() => onProjectSelect(project)}
                                  >
                                    <img src={project.logo} alt={""} />
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
                    {taxonomyItem.projects &&
                      taxonomyItem.projects.length > 0 && (
                        <div className={styles.startSubmenu__innerSubSub}>
                          {taxonomyItem.projects.map(
                            (project, projectIndex) => (
                              <div
                                key={projectIndex}
                                style={{ cursor: "pointer" }}
                                className={
                                  styles.startSubmenu__innerSingle__title
                                }
                                onClick={() => onProjectSelect(project)}
                              >
                                <img
                                  src={project.logo || "default-logo.png"}
                                  alt=""
                                />
                                <h5>{project.title}</h5>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {menu.CV && (
            <div
              className={styles.startMenu__innerSingle}
              // onClick={onDocumentSelect}
              onClick={() =>
                onWindowSelect({
                  type: "windowClassic",
                  title: "Curriculum",
                  slug: "cv",
                  logo: "/img/icons/cv.png",
                })
              }
            >
              <div className={styles.startMenu__innerSingle__title}>
                <img src="/img/icons/cv.png" alt="" />
                <h2>{menu.CV.title}</h2>
              </div>
            </div>
          )}
          {menu.Contact && (
            <div
              className={styles.startMenu__innerSingle}
              onClick={() =>
                onWindowSelect({
                  type: "windowContact",
                  title: "Contact",
                  slug: "contact",
                  logo: "/img/icons/contact.png",
                })
              }
            >
              <div className={styles.startMenu__innerSingle__title}>
                <img src="/img/icons/contact.png" alt="" />
                <h2>{menu.Contact.title}</h2>
              </div>
            </div>
          )}
          {menu.Jeux && (
            <div
              className={styles.startMenu__innerSingle}
              onClick={onDocumentSelect}
            >
              <div className={styles.startMenu__innerSingle__title}>
                <img src="/img/icons/games.png" alt="" />
                <h2>{menu.Jeux.title}</h2>
              </div>
              <div className={styles.startSubmenu__inner}>
                <div
                  key="rubiks"
                  className={styles.startSubmenu__innerSingle}
                  onClick={() =>
                    onWindowSelect({
                      type: "windowClassic",
                      title: "Rubiks",
                      slug: "rubiks",
                      logo: "/img/icons/rubiks.png",
                    })
                  }
                >
                  <div className={styles.startSubmenu__innerSingle__title}>
                    <img src="/img/icons/rubiks.png" alt="" />
                    <h3 className={styles.startSubmenu__cat}>Rubiks</h3>
                  </div>
                </div>
                <div
                  key="picross"
                  className={styles.startSubmenu__innerSingle}
                  onClick={() =>
                    onWindowSelect({
                      type: "windowClassic",
                      title: "Picross",
                      slug: "picross",
                      logo: "/img/icons/picross.png",
                    })
                  }
                >
                  <div className={styles.startSubmenu__innerSingle__title}>
                    <img src="/img/icons/picross.png" alt="" />
                    <h3 className={styles.startSubmenu__cat}>Picross</h3>
                  </div>
                </div>
                <div
                  key="minesweeper"
                  className={styles.startSubmenu__innerSingle}
                  onClick={() =>
                    onWindowSelect({
                      type: "windowClassic",
                      title: "Démineur",
                      slug: "minesweeper",
                      logo: "/img/icons/minesweeper.png",
                    })
                  }
                >
                  <div className={styles.startSubmenu__innerSingle__title}>
                    <img src="/img/icons/minesweeper.png" alt="" />
                    <h3 className={styles.startSubmenu__cat}>Démineur</h3>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
