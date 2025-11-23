/** @file React context for persisting and exposing user unit preferences. */

import type { JSX, ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { detectUnitSystem, type UnitSystem } from "./unit-system";

interface UnitPreferencesContextValue {
  readonly unitSystem: UnitSystem;
  readonly hasUserPreference: boolean;
  setUnitSystem: (next: UnitSystem) => void;
  resetToLocaleDefault: () => void;
}

const STORAGE_KEY = "wildside.unitSystem";

const UnitPreferencesContext = createContext<UnitPreferencesContextValue | null>(null);

const canUseDom = (): boolean => typeof window !== "undefined";

const readStoredUnitSystem = (): UnitSystem | null => {
  if (!canUseDom()) return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "metric" || stored === "imperial") {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
};

const persistUnitSystem = (unitSystem: UnitSystem) => {
  if (!canUseDom()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, unitSystem);
  } catch {
    // Ignored: storage may be unavailable (e.g., private browsing).
  }
};

const clearPersistedUnitSystem = () => {
  if (!canUseDom()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignored: best-effort removal.
  }
};

export interface UnitPreferencesProviderProps {
  readonly children: ReactNode;
}

export function UnitPreferencesProvider({ children }: UnitPreferencesProviderProps): JSX.Element {
  const { i18n } = useTranslation();

  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() =>
    detectUnitSystem(i18n.language),
  );

  const [hasUserPreference, setHasUserPreference] = useState<boolean>(false);

  useEffect(() => {
    if (!canUseDom()) return;
    const stored = readStoredUnitSystem();
    if (!stored) return;
    setUnitSystemState(stored);
    setHasUserPreference(true);
  }, []);

  useEffect(() => {
    if (hasUserPreference) {
      return;
    }
    setUnitSystemState(detectUnitSystem(i18n.language));
  }, [hasUserPreference, i18n.language]);

  const setUnitSystem = useCallback((next: UnitSystem) => {
    setUnitSystemState(next);
    setHasUserPreference(true);
    persistUnitSystem(next);
  }, []);

  const resetToLocaleDefault = useCallback(() => {
    const detected = detectUnitSystem(i18n.language);
    setUnitSystemState(detected);
    setHasUserPreference(false);
    clearPersistedUnitSystem();
  }, [i18n.language]);

  const value = useMemo<UnitPreferencesContextValue>(() => {
    return {
      unitSystem,
      hasUserPreference,
      setUnitSystem,
      resetToLocaleDefault,
    };
  }, [hasUserPreference, resetToLocaleDefault, setUnitSystem, unitSystem]);

  return (
    <UnitPreferencesContext.Provider value={value}>{children}</UnitPreferencesContext.Provider>
  );
}

export const useUnitPreferences = (): UnitPreferencesContextValue => {
  const context = useContext(UnitPreferencesContext);
  if (!context) {
    throw new Error("useUnitPreferences must be used within a UnitPreferencesProvider");
  }
  return context;
};
