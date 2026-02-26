import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check if user had a saved theme, otherwise default to "light"
  const [theme, setTheme] = useState(
    localStorage.getItem("styleDecor-theme") || "light"
  );

  useEffect(() => {
    // Apply theme to the HTML element (DaisyUI reads data-theme)
    document.documentElement.setAttribute("data-theme", theme);
    // Save preference
    localStorage.setItem("styleDecor-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);