import LanguageSelector from "@/components/custom/LanguageSelector";
import ThemeSelector from "@/components/custom/ThemeSelector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useTranslate } from "@/hooks";
import { useApplicationConfigStore } from "@/store/applicationConfigStore";
import React from "react";
import LoginPage from "../login/LoginPage";
import { CardDemo } from "@/components/custom/CardDemo";
import { cn } from "@/lib/utils";

type Props = {};

export const HomePage = (props: Props) => {
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
    </div>
  );
};
