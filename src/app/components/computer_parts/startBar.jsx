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

  const [openMenu, setOpenMenu] = useState(null); // Track which menu is open

  const toggleMenu = (menuKey) => {
    setOpenMenu(openMenu === menuKey ? null : menuKey);
  };

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
              <button
                className={styles.startMenu__innerSingle__title}
                onClick={() => toggleMenu("projects")}
              >
                <img src="/img/icons/projects.png" alt="" />
                <h2>{translate("projects", lang)}</h2>
              </button>
              {/* Iterate through the project taxonomies */}
              <div
                className={`${styles.startSubmenu__inner} ${
                  openMenu === "projects" ? styles.active : ""
                }`}
              >
                {menu.projects.map((taxonomyItem, taxonomyIndex) => (
                  <div
                    key={taxonomyIndex}
                    className={styles.startSubmenu__innerSingle}
                  >
                    <button
                      className={styles.startSubmenu__innerSingle__title}
                      onClick={() => toggleMenu("tax")}
                    >
                      <img src={taxonomyItem.logo} alt="" />
                      <button className={styles.startSubmenu__cat}>
                        {taxonomyItem.taxonomy}
                      </button>
                    </button>

                    {/* Render the child taxonomies and their projects */}
                    {taxonomyItem.children && (
                      <div
                        className={`${styles.startSubmenu__innerSubSubSub} ${
                          openMenu === "tax" ? styles.active : ""
                        }`}
                      >
                        {taxonomyItem.children.map((child, childIndex) => (
                          <div
                            key={childIndex}
                            className={
                              styles.startSubmenu__innerSingleSubSubSub
                            }
                          >
                            <button
                              className={
                                styles.startSubmenu__innerSingle__title
                              }
                            >
                              <img src={child.logo} alt="" />
                              <h4>{child.taxonomy}</h4>
                            </button>

                            {/* Render the list of projects for each child taxonomy */}
                            {child.projects && (
                              <div className={styles.startSubmenu__innerSubSub}>
                                {child.projects.map((project, projectIndex) => (
                                  <button
                                    key={projectIndex} // Add a key here for the project button
                                    className={
                                      styles.startSubmenu__innerSingle__title
                                    }
                                    style={{ cursor: "pointer" }}
                                    onClick={() => onProjectSelect(project)}
                                  >
                                    <img src={project.logo} alt={""} />
                                    <h5>{project.title}</h5>
                                  </button>
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
                              <button
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
                              </button>
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
            <button
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
            </button>
          )}
          {menu.Contact && (
            <button
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
            </button>
          )}
          {menu.Jeux && (
            <div
              className={styles.startMenu__innerSingle}
              onClick={onDocumentSelect}
            >
              <button className={styles.startMenu__innerSingle__title}>
                <img src="/img/icons/games.png" alt="" />
                <h2>{menu.Jeux.title}</h2>
              </button>
              <div className={styles.startSubmenu__inner}>
                <button
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
                </button>
                <button
                  key="connect"
                  className={styles.startSubmenu__innerSingle}
                  onClick={() =>
                    onWindowSelect({
                      type: "windowClassic",
                      title: "Connect 4",
                      slug: "connect",
                      logo: "/img/icons/connect.png",
                    })
                  }
                >
                  <div className={styles.startSubmenu__innerSingle__title}>
                    <img src="/img/icons/connect.png" alt="" />
                    <h3 className={styles.startSubmenu__cat}>Puissance 4</h3>
                  </div>
                </button>

                
                <button
                  key="horse"
                  className={styles.startSubmenu__innerSingle}
                  onClick={() =>
                    onWindowSelect({
                      type: "windowClassic",
                      title: "Horse Game",
                      slug: "horse",
                      logo: "/img/icons/horse.png",
                    })
                  }
                >
                  <div className={styles.startSubmenu__innerSingle__title}>
                    <img src="/img/icons/horse.png" alt="" />
                    <h3 className={styles.startSubmenu__cat}>Horse Game</h3>
                  </div>
                </button>
                <button
                  key="quizz"
                  className={styles.startSubmenu__innerSingle}
                  onClick={() =>
                    onWindowSelect({
                      type: "windowClassic",
                      title: "Who wants to become a Millionaire",
                      slug: "quizz",
                      logo: "/img/icons/horse.png",
                    })
                  }
                >
                  <div className={styles.startSubmenu__innerSingle__title}>
                    <img src="/img/icons/horse.png" alt="" />
                    <h3 className={styles.startSubmenu__cat}>Who wants to become..</h3>
                  </div>
                </button>
                <button
                  key="plateformer"
                  className={styles.startSubmenu__innerSingle}
                  onClick={() =>
                    onWindowSelect({
                      type: "windowClassic",
                      title: "Plateformer",
                      slug: "plateformer",
                      logo: "/img/icons/plateformer.png",
                    })
                  }
                >
                  <div className={styles.startSubmenu__innerSingle__title}>
                    <img src="/img/icons/plateformer.png" alt="" />
                    <h3 className={styles.startSubmenu__cat}>Plateformer</h3>
                  </div>
                </button>
                {/* <div
                  key="tetris"
                  className={styles.startSubmenu__innerSingle}
                  onClick={() =>
                    onWindowSelect({
                      type: "windowClassic",
                      title: "Tetris",
                      slug: "tetris",
                      logo: "/img/icons/rubiks.png",
                    })
                  }
                >
                  <div className={styles.startSubmenu__innerSingle__title}>
                    <img src="/img/icons/rubiks.png" alt="" />
                    <h3 className={styles.startSubmenu__cat}>Rubiks</h3>
                  </div>
                </div> */}
                <button
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
                </button>
                <button
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
                </button>
                <button
                  key="virtualvisit"
                  className={styles.startSubmenu__innerSingle}
                  onClick={() =>
                    onWindowSelect({
                      type: "windowClassic",
                      title: "Visite virtuelle",
                      slug: "virtualvisit",
                      logo: "/img/icons/virtualvisit.png",
                    })
                  }
                >
                  <div className={styles.startSubmenu__innerSingle__title}>
                    <img src="/img/icons/virtualvisit.png" alt="" />
                    <h3 className={styles.startSubmenu__cat}>
                      Visite virtuelle
                    </h3>
                  </div>
                </button>
                <button
                  key="cardgame"
                  className={styles.startSubmenu__innerSingle}
                  onClick={() =>
                    onWindowSelect({
                      type: "windowClassic",
                      title: "Card game",
                      slug: "cardgame",
                      logo: "/img/icons/card.png",
                    })
                  }
                >
                  <div className={styles.startSubmenu__innerSingle__title}>
                    <img src="/img/icons/card.png" alt="" />
                    <h3 className={styles.startSubmenu__cat}>
                      Card Game
                    </h3>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.startMenu__innerMobile}>
          {menu.projects && (
            <div
              className={` ${styles.startMenu__innerSingle} ${styles.border} `}
            >
              <button
                className={` ${styles.startMenu__innerSingle__title} `}
                onClick={() => toggleMenu("projects")}
              >
                <img src="/img/icons/projects.png" alt="" />
                <h2>{translate("projects", lang)}</h2>
              </button>
              {/* Iterate through the project taxonomies */}
              <div
                className={`${styles.startSubmenu__inner} ${
                  openMenu === "projects" ? styles.active : ""
                }`}
              >
                {menu.projects.map((taxonomyItem, taxonomyIndex) => (
                  <div
                    key={taxonomyIndex}
                    className={styles.startSubmenu__innerSingle}
                  >
                    <button
                      className={styles.startSubmenu__innerSingle__title}
                      onClick={() => toggleMenu("tax")}
                    >
                      <img src={taxonomyItem.logo} alt="" />
                      <button className={styles.startSubmenu__cat}>
                        {taxonomyItem.taxonomy}
                      </button>
                    </button>

                    {/* Render the child taxonomies and their projects */}
                    {taxonomyItem.children && (
                      <div
                        className={`${styles.startSubmenu__innerSubSubSub} ${
                          openMenu === "tax" ? styles.active : ""
                        }`}
                      >
                        {taxonomyItem.children.map((child, childIndex) => (
                          <div
                            key={childIndex}
                            className={
                              styles.startSubmenu__innerSingleSubSubSub
                            }
                          >
                            <button
                              className={
                                styles.startSubmenu__innerSingle__title
                              }
                              onClick={() => toggleMenu(child.taxonomy)}
                            >
                              <img src={child.logo} alt="" />
                              <h4>{child.taxonomy}</h4>
                            </button>

                            {/* Render the list of projects for each child taxonomy */}
                            {child.projects && (
                              <div
                                className={` ${
                                  styles.startSubmenu__innerSubSub
                                } ${
                                  openMenu === child.taxonomy
                                    ? styles.active
                                    : ""
                                }`}
                              >
                                {child.projects.map((project, projectIndex) => (
                                  <button
                                    key={projectIndex} // Add a key here for the project button
                                    className={
                                      styles.startSubmenu__innerSingle__title
                                    }
                                    style={{ cursor: "pointer" }}
                                    onClick={() => onProjectSelect(project)}
                                  >
                                    <img src={project.logo} alt={""} />
                                    <h5>{project.title}</h5>
                                  </button>
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
                              <button
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
                              </button>
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
            <button
              className={` ${styles.startMenu__innerSingle} ${styles.border}`}
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
            </button>
          )}
          {menu.Contact && (
            <button
              className={` ${styles.startMenu__innerSingle} ${styles.border}`}
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
            </button>
          )}
          {menu.Jeux && (
            <div
              className={` ${styles.startMenu__innerSingle} ${styles.border} `}
            >
              <button
                className={styles.startMenu__innerSingle__title}
                onClick={() => toggleMenu("game")}
              >
                <img src="/img/icons/games.png" alt="" />
                <h2>{menu.Jeux.title}</h2>
              </button>

              <div
                className={` ${styles.startSubmenu__inner}
              ${openMenu === "game" ? styles.active : ""}`}
              >
                <button
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
                </button>

                {/* <div
                  key="tetris"
                  className={styles.startSubmenu__innerSingle}
                  onClick={() =>
                    onWindowSelect({
                      type: "windowClassic",
                      title: "Tetris",
                      slug: "tetris",
                      logo: "/img/icons/rubiks.png",
                    })
                  }
                >
                  <div className={styles.startSubmenu__innerSingle__title}>
                    <img src="/img/icons/rubiks.png" alt="" />
                    <h3 className={styles.startSubmenu__cat}>Rubiks</h3>
                  </div>
                </div> */}
                <button
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
                </button>
                <button
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
                </button>
                <button
                  key="virtualvisit"
                  className={styles.startSubmenu__innerSingle}
                  onClick={() =>
                    onWindowSelect({
                      type: "windowClassic",
                      title: "Visite virtuelle",
                      slug: "virtualvisit",
                      logo: "/img/icons/virtualvisit.png",
                    })
                  }
                >
                  <div className={styles.startSubmenu__innerSingle__title}>
                    <img src="/img/icons/virtualvisit.png" alt="" />
                    <h3 className={styles.startSubmenu__cat}>
                      Visite virtuelle
                    </h3>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
