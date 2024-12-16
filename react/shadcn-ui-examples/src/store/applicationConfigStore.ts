import i18n from "@/i18n";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";


interface IAppConfStore {
  themeMode: ThemeMode;
  language: string;
  toggleLanguage: (l: string) => void;
  toggleThemeMode: (m: ThemeMode) => void;
  initializeTheme: () => void; // New function to initialize the theme
}

export const useApplicationConfigStore = create<IAppConfStore>()(
  persist(
    (set, get) => ({
      themeMode: "light",
      language: "en",

      toggleLanguage: (value: string) => {
        i18n.changeLanguage(value); // Update i18next language
        set({
          language: value,
        });
      },
      toggleThemeMode: (value: ThemeMode) => {
        if (value === "system") {
          const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          document.documentElement.classList.toggle("dark", systemPrefersDark);
        } else {
          document.documentElement.classList.toggle("dark", value === "dark");
        }

        set({ themeMode: value });
      },
      initializeTheme: () => {
        const storedTheme = get().themeMode;
        if (storedTheme === "system") {
          const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          document.documentElement.classList.toggle("dark", systemPrefersDark);
        } else {
          document.documentElement.classList.toggle(
            "dark",
            storedTheme === "dark"
          );
        }
      },
    }),
    {
      name: "applicationConfig", // Persist the state under this key
    }
  )
);
