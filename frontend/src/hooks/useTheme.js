import { useState, useEffect } from "react";
import { THEME } from "../utils/constants";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || THEME.LIGHT;
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === THEME.DARK) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
  };

  return { theme, toggleTheme, isDark: theme === THEME.DARK };
};
