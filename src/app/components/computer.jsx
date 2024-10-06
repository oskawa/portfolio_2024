"use client";
import { useState, useEffect } from "react";
import http from "./../axios/http";
import { BottomBar } from "./computer_parts/bottomBar";
import { WindowProject } from "./computer_parts/windowProject";
import { PaintWindow } from "./computer_parts/paintWindow";
import {ContactForm} from "./computer_parts/contact"
import { Loader } from "./loader";
import { useRouter } from 'next/router';

import styles from "./Computer.module.scss";

export function Computer() {
  const [selectedProjects, setSelectedProjects] = useState([]); // Track the selected project
  const [focusWindow, setFocusWindow] = useState(null); // Track the active window
  const [document, setDocument] = useState(false); // Track the active window
  const [minimizedProjects, setMinimizedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState([]);
  const [links, setLinks] = useState([]);
  const [straight, setStraight] = useState(false);

  const handleStraight = () => {
    setStraight(!straight);
  };

  const handleProjectSelect = (project) => {
    if (!selectedProjects.find((p) => p.slug === project.slug)) {
      setSelectedProjects([...selectedProjects, project]); // Add project to selected projects
    }
    setFocusWindow(project.slug); // Set focus to the selected project
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

  // useEffect(() => {
  //   // Simulating the loading process
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 2000); // Simulates a 2-second loading delay (adjust as needed)

  //   return () => clearTimeout(timer); // Cleanup timer on component unmount
  // }, []);

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
    <div className={`${styles.inner} ${straight ? styles.straight : ""}`}>
      {loading && <Loader progress={progress} />}
      {document && (
        <PaintWindow
          onClick={() => handleFocusWindow("cv")} // Handle click to activate
        />
      )}
      <ContactForm/>
      <BottomBar
        onProjectSelect={handleProjectSelect}
        selectedProjects={selectedProjects}
        minimizedProjects={minimizedProjects}
        onProjectClick={handleClickBottomBarProject}
        focusProject={focusWindow}
        onDocumentSelect={handleDocument}
        menu={menu}
        links={links}
        onStraight={handleStraight}
      />

      {selectedProjects &&
        selectedProjects.map((project) => (
          <div key={project.slug}>
            <WindowProject
              data={project.slug}
              onClose={() => handleCloseWindow(project.slug)}
              isFocus={focusWindow === project.slug} // Pass active state to WindowProject
              onClick={() => handleFocusWindow(project.slug)} // Handle click to activate
              isMinimized={minimizedProjects.includes(project.slug)} // Pass minimized state
              onMinimize={() => handleMinimizeWindow(project.slug)}
            />
          </div>
        ))}
    </div>
  );
}
