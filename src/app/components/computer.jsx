"use client";
import { useState } from "react";
import { BottomBar } from "./computer_parts/bottomBar";
import { WindowProject } from "./computer_parts/windowProject";
import styles from "./Computer.module.scss";
export function Computer() {
  const [selectedProjects, setSelectedProjects] = useState([]); // Track the selected project
  const [focusWindow, setFocusWindow] = useState(null); // Track the active window

  const handleProjectSelect = (project) => {
    // Check if the project is already selected
    if (!selectedProjects.find((p) => p.slug === project.slug)) {
      setSelectedProjects([...selectedProjects, project]); // Add project to selected projects
      if (focusWindow === project.slug) {
        setFocusWindow(null);
      }
    }
  };

  const handleFocusWindow = (slug) => {
    setFocusWindow(slug); // Set the active window
  };

  const handleCloseWindow = (slug) => {
    setSelectedProjects(selectedProjects.filter((p) => p.slug !== slug)); // Remove project from selected projects
  };

  return (
    <div className={styles.inner}>
      <BottomBar onProjectSelect={handleProjectSelect} selectedProjects={selectedProjects} />
      {selectedProjects &&
        selectedProjects.map((project) => (
          <div key={project.slug}>
            <WindowProject
              data={project.slug}
              onClose={() => handleCloseWindow(project.slug)}
              isFocus={focusWindow === project.slug} // Pass active state to WindowProject
              onClick={() => handleFocusWindow(project.slug)} // Handle click to activate
            />
          </div>
        ))}
    </div>
  );
}
