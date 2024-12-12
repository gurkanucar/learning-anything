import i18n from "@/i18n";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IAppConfStore {
  themeMode: string;
  language: string;
  toggleLanguage: (l: string) => void;
  toggleThemeMode: (m: string) => void;
  initializeTheme: () => void; // New function to initialize the theme
}

export const useApplicationConfigStore = create<IAppConfStore>()(
  persist(
    (set, get) => ({
      themeMode: "LIGHT",
      language: "en",

      toggleLanguage: (value: string) => {
        i18n.changeLanguage(value); // Update i18next language
        set({
          language: value,
        });
      },
      toggleThemeMode: (value: string) => {
        if (value === "SYSTEM") {
          const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          document.documentElement.classList.toggle("dark", systemPrefersDark);
        } else {
          document.documentElement.classList.toggle("dark", value === "DARK");
        }

        set({
          themeMode: value,
        });
      },
      initializeTheme: () => {
        const storedTheme = get().themeMode;
        if (storedTheme === "SYSTEM") {
          const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          document.documentElement.classList.toggle("dark", systemPrefersDark);
        } else {
          document.documentElement.classList.toggle(
            "dark",
            storedTheme === "DARK"
          );
        }
      },
    }),
    {
      name: "applicationConfig", // Persist the state under this key
    }
  )
);
