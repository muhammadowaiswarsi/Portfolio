"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  COLOR_MODE_STORAGE_KEY,
  type ColorMode,
} from "@/lib/project-theme";

type ColorModeContextValue = {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextValue | null>(null);
const COLOR_MODE_EVENT = "cy-color-mode-change";

function subscribeToColorMode(onStoreChange: () => void) {
  window.addEventListener(COLOR_MODE_EVENT, onStoreChange);
  return () => window.removeEventListener(COLOR_MODE_EVENT, onStoreChange);
}

function publishColorMode(mode: ColorMode) {
  applyMode(mode);
  window.dispatchEvent(new Event(COLOR_MODE_EVENT));
}

function serverColorMode(): ColorMode {
  return "dark";
}

function readStoredMode(): ColorMode {
  if (typeof document === "undefined") return "dark";

  const attr = document.documentElement.getAttribute("data-color-mode");
  if (attr === "light" || attr === "dark") return attr;

  try {
    const stored = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    return "dark";
  }

  return "dark";
}

function applyMode(mode: ColorMode) {
  document.documentElement.setAttribute("data-color-mode", mode);
  document.documentElement.style.colorScheme = mode;
  window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(
    subscribeToColorMode,
    readStoredMode,
    serverColorMode,
  );

  const setMode = useCallback((next: ColorMode) => {
    publishColorMode(next);
  }, []);

  const toggleMode = useCallback(() => {
    publishColorMode(readStoredMode() === "dark" ? "light" : "dark");
  }, []);

  const value = useMemo<ColorModeContextValue>(
    () => ({ mode, setMode, toggleMode }),
    [mode, setMode, toggleMode],
  );

  return (
    <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>
  );
}

export function useColorMode() {
  const context = useContext(ColorModeContext);

  if (!context) {
    throw new Error("useColorMode must be used within ColorModeProvider");
  }

  return context;
}
