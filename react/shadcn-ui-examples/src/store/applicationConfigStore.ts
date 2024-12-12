import i18n from "@/i18n";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IAppConfStore {
  themeMode: string;
  language: string;
  toggleLanguage: (l: string) => void;
  toggleThemeMode: (m: string) => void;
}

export const useApplicationConfigStore = create<IAppConfStore>()(
  persist(
    (set) => ({
      themeMode: "LIGHT",
      language: "en",

      toggleLanguage: (value: string) => {
        i18n.changeLanguage(value); // Update i18next language
        set({
          language: value,
        });
      },
      toggleThemeMode: (value: string) => {
        set({
          themeMode: value,
        });
      },
    }),
    {
      name: "applicationConfig", // Persist the state under this key
    }
  )
);
