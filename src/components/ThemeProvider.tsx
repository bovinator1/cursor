"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper for SSR
const getSystemTheme = (): "dark" | "light" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  attribute = "data-theme",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  // Try to get the theme from localStorage, fallback to defaultTheme
  const [theme, setThemeState] = useState<Theme>(() => {
    // We need to check if we're in the browser to avoid errors during SSR
    if (typeof window !== "undefined") {
      try {
        const storedTheme = localStorage.getItem("theme") as Theme | null;
        return storedTheme || defaultTheme;
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  // Function to set the theme in state and localStorage
  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("theme", newTheme);
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;

    if (disableTransitionOnChange) {
      root.classList.add("disable-transition");
      window.setTimeout(() => {
        root.classList.remove("disable-transition");
      }, 0);
    }

    // Remove previous theme classes
    root.classList.remove("light", "dark");

    // Apply new theme
    if (theme === "system" && enableSystem) {
      const systemTheme = getSystemTheme();
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Set attribute as well (for components that may use this)
    if (attribute === "class") {
      // Already handled above
    } else {
      if (theme === "system" && enableSystem) {
        const systemTheme = getSystemTheme();
        root.setAttribute(attribute, systemTheme);
      } else {
        root.setAttribute(attribute, theme);
      }
    }
  }, [theme, attribute, disableTransitionOnChange, enableSystem]);

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Initial check
    if (theme === "system") {
      // We don't need to update any state as the effect above will handle the DOM updates
    }

    // Listen for changes
    const listener = (event: MediaQueryListEvent) => {
      if (theme === "system") {
        // Force re-render to update the theme
        setThemeState("system");
      }
    };

    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", listener);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(listener);
    }

    // Clean up
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", listener);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(listener);
      }
    };
  }, [theme, enableSystem]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}; 