import React, { useState } from "react";
import { Menu, X, Home, User, Settings } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "../ui/menubar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTranslate } from "@/hooks";

interface NavbarLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { t } = useTranslate();

  const links: NavbarLink[] = [
    {
      label: t("navbar_home"),
      href: "/",
      icon: <Home className="text-primary" size={20} />,
    },
    {
      label: t("navbar_profile"),
      href: "/profile",
      icon: <User className="text-primary" size={20} />,
    },
  ];

  return (
    <nav className="bg-background shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left Side Links */}
        <div className="flex items-center space-x-6">
          <a
            href="/"
            className="text-lg font-bold text-foreground hover:text-primary transition"
          >
            MyApp
          </a>
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center text-muted-foreground hover:text-foreground transition"
              >
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right Side: Selectors & Avatar */}
        <div className="flex items-center">
          <ThemeSelector />
          <LanguageSelector />
          <Menubar className="bg-transparent border-none">
            <MenubarMenu>
              <MenubarTrigger>
                <Avatar>
                  <AvatarImage
                    className="cursor-pointer"
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  {t("menu.newTab")} <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  {t("menu.newWindow")} <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled>{t("menu.newIncognito")}</MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>{t("menu.share")}</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>{t("menu.emailLink")}</MenubarItem>
                    <MenubarItem>{t("menu.messages")}</MenubarItem>
                    <MenubarItem>{t("menu.notes")}</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem>
                  {t("menu.print")} <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={t("navbar.toggleMenu")}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      <div
        className={`md:hidden bg-background border-t border-border transition-all ${
          isMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center text-muted-foreground hover:text-foreground transition"
            >
              {link.icon && <span className="mr-2">{link.icon}</span>}
              {link.label}
            </a>
          ))}
          <div className="mt-4 border-t border-border pt-2">
            <a
              href="/profile"
              className="block px-4 py-2 text-sm hover:bg-muted hover:text-foreground rounded-md transition"
            >
              {t("navbar_profile")}
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm hover:bg-muted hover:text-foreground rounded-md transition"
            >
              {t("navbar_settings")}
            </a>
            <button
              onClick={() => alert(t("navbar_signOut"))}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-destructive hover:text-destructive-foreground rounded-md transition"
            >
              {t("navbar_signOut")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
