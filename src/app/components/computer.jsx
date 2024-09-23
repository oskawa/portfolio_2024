"use client";
import { useState } from "react";
import { BottomBar } from "./computer_parts/bottomBar";
import { WindowProject } from "./computer_parts/windowProject";
import { PaintWindow } from "./computer_parts/paintWindow";
import styles from "./Computer.module.scss";

export function Computer() {
  const [selectedProjects, setSelectedProjects] = useState([]); // Track the selected project
  const [focusWindow, setFocusWindow] = useState(null); // Track the active window
  const [document, setDocument] = useState(false); // Track the active window
  const [minimizedProjects, setMinimizedProjects] = useState([]);

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

  return (
    <div className={styles.inner}>
      {document && (
        <PaintWindow/>
      )}
      <BottomBar
        onProjectSelect={handleProjectSelect}
        selectedProjects={selectedProjects}
        minimizedProjects={minimizedProjects}
        onProjectClick={handleClickBottomBarProject}
        focusProject={focusWindow}
        onDocumentSelect={handleDocument}
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
