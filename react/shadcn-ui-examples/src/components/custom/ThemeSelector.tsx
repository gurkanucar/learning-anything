import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useApplicationConfigStore } from "@/store/applicationConfigStore";
import { Sun, Moon, Monitor } from "lucide-react"; // Import icons for light, dark, and system modes

const themes = [
  { value: "LIGHT", label: "Light", icon: <Sun className="h-5 w-5" /> },
  { value: "DARK", label: "Dark", icon: <Moon className="h-5 w-5" /> },
  { value: "SYSTEM", label: "System", icon: <Monitor className="h-5 w-5" /> },
];

const ThemeSelector: React.FC = () => {
  const { themeMode, toggleThemeMode, initializeTheme } =
    useApplicationConfigStore();

  useEffect(() => {
    initializeTheme(); // Initialize the theme on mount
  }, [initializeTheme]);

  const currentTheme = themes.find((theme) => theme.value === themeMode);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2 p-2 bg-neutral-100 dark:bg-neutral-800 shadow-sm border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">
          {React.cloneElement(currentTheme?.icon || <Sun />, {
            className: "h-5 w-5",
            stroke: themeMode === "DARK" ? "white" : "black", // Adapt icon color
          })}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-neutral-100 dark:bg-neutral-800 shadow-md rounded-md border border-neutral-300 dark:border-neutral-700">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => toggleThemeMode(theme.value)}
            className={`flex items-center gap-2 p-2 cursor-pointer rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition ${
              themeMode === theme.value ? "font-bold" : "font-normal"
            }`}
          >
            {React.cloneElement(theme.icon, {
              className: "h-5 w-5",
              stroke: themeMode === "DARK" ? "white" : "black", // Adapt icon color
            })}
            <span className="text-neutral-900 dark:text-neutral-100">
              {theme.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
