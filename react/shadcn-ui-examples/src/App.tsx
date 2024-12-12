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

function App() {
  const { t } = useTranslate();

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
    </div>
  );
}

export default App;
