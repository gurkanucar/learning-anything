import "./App.css";
import { CardDemo } from "./components/custom/CardDemo";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { useTranslate } from "./hooks";
import { cn } from "@/lib/utils";
import { useApplicationConfigStore } from "./store/applicationConfigStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Button } from "./components/ui/button";

type TypeLocalization = {
  locale: string;
  flag: string;
};

function App() {
  const { t } = useTranslate();
  const { language, toggleLanguage } = useApplicationConfigStore();

  const localizations: TypeLocalization[] = [
    {
      locale: "tr",
      flag: "/assets/flags/TR.svg",
    },
    {
      locale: "en",
      flag: "/assets/flags/EN.svg",
    },
  ];

  return (
    <>
      <div className="flex justify-center items-center h-screen flex-col gap-5">
        <Card className={cn("w-[380px]")}>
          <CardHeader>
            <CardTitle>
              translated text {`=>`} {t("hello")} | language = {language}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full">{t("Select Language")}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {localizations.map((loc) => (
                  <DropdownMenuItem
                    key={loc.locale}
                    onClick={() => toggleLanguage(loc.locale)}
                  >
                    <img
                      src={loc.flag}
                      alt={loc.locale}
                      className="w-6 h-6 mr-2"
                    />
                    {t(loc.locale)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
        <CardDemo />
      </div>
    </>
  );
}

export default App;
