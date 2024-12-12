import "./App.css";
import { CardDemo } from "./components/custom/CardDemo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "./components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslate } from "./hooks";
import LanguageSelector from "./components/custom/LanguageSelector";
import ThemeSelector from "./components/custom/ThemeSelector";
import LoginPage from "./pages/login/LoginPage";
import { Toaster } from "@/components/ui/sonner";
import { useApplicationConfigStore } from "./store/applicationConfigStore";
function App() {
  const { t } = useTranslate();
  const { themeMode } = useApplicationConfigStore();
  return (
    <div className="flex justify-center items-center flex-col gap-5">
      <Card className={cn("w-[380px]")}>
        <CardHeader>
          <CardDescription>
            translated text {`=>`} {t("hello")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-5">
          <LanguageSelector />
          <ThemeSelector />
        </CardContent>
      </Card>
      <LoginPage />
      <CardDemo />
      <Toaster richColors theme={themeMode} />
    </div>
  );
}

export default App;
