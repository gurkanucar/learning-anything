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
      name: "applicationConfig",
    }
  )
);
