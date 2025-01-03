import { useState, useEffect } from "react";
import styles from "./themeChanger.module.css";

export default function ThemeChanger() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // const classname = document.body.className;
  // console.log(classname);

  useEffect(() => {
    document.body.className = isDarkMode ? styles.dark : styles.light;
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={styles.themeChanger}>
      <span>Light</span>
      <label className={styles.switch}>
        <input type="checkbox" onChange={toggleTheme} checked={isDarkMode} />
        <span className={styles.slider}></span>
      </label>
      <span>Dark</span>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import styles from "./ThemeChanger.module.css"; // Replace with actual CSS path

// export default function ThemeChanger() {
//   const location = useLocation();

//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     // For pages other than login, load theme from localStorage or default to light mode
//     if (location.pathname === "/login") return false;
//     return localStorage.getItem(`theme-${location.pathname}`) === "dark";
//   });

//   useEffect(() => {
//     if (location.pathname === "/login") {
//       // Preserve login page styling without applying theme
//       document.body.className = "";
//       return;
//     }

//     // Apply light or dark mode for other pages
//     document.body.className = isDarkMode ? styles.dark : styles.light;

//     // Save the theme for the current page
//     localStorage.setItem(
//       `theme-${location.pathname}`,
//       isDarkMode ? "dark" : "light"
//     );
//   }, [isDarkMode, location.pathname]);

//   const toggleTheme = () => {
//     setIsDarkMode((prevMode) => !prevMode);
//   };

//   // Do not render theme toggle on login page
//   if (location.pathname === "/login") {
//     return null;
//   }

//   return (
//     <div className={styles.themeChanger}>
//       <span>Light</span>
//       <label className={styles.switch}>
//         <input type="checkbox" onChange={toggleTheme} checked={isDarkMode} />
//         <span className={styles.slider}></span>
//       </label>
//       <span>Dark</span>
//     </div>
//   );
// }
