import { useTranslate } from "@/hooks";
import { useApplicationConfigStore } from "@/store/applicationConfigStore";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

type TypeLocalization = {
  locale: string;
  flag: string;
};

const localizations: TypeLocalization[] = [
  {
    locale: "tr",
    flag: "/assets/flags/tr.svg",
  },
  {
    locale: "en",
    flag: "/assets/flags/en.svg",
  },
];

const LanguageSelector: React.FC = () => {
  const { t } = useTranslate();
  const { language, toggleLanguage } = useApplicationConfigStore();

  const currentLocalization = localizations.find(
    (localization) => localization.locale === language
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2 p-2 bg-white shadow-sm border border-gray-300 rounded-md hover:bg-gray-100 transition">
          <img
            src={currentLocalization?.flag}
            alt={currentLocalization?.locale}
            className="h-6 w-8 rounded-sm object-cover"
            draggable={false}
          />
          <span className="font-medium text-gray-700">
            {t(currentLocalization?.locale || "")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white shadow-md rounded-md border border-gray-200">
        {localizations.map((loc) => (
          <DropdownMenuItem
            key={loc.locale}
            onClick={() => toggleLanguage(loc.locale)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 transition cursor-pointer rounded-md"
          >
            <img
              src={loc.flag}
              alt={loc.locale}
              className="h-6 w-8 rounded-sm object-cover"
              draggable={false}
            />
            <span className="font-medium text-gray-700">{t(loc.locale)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
