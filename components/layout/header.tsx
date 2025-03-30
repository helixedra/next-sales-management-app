"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  RiBox3Fill,
  RiBarChart2Fill,
  RiHome6Fill,
  RiLogoutBoxRFill,
  RiMoonFill,
  RiSunFill,
} from "react-icons/ri";
import { Button, buttonVariants } from "@/components/ui/button";
import ui from "@/app/data/ui.json";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: ui.mainmenu.sales, icon: RiBox3Fill },
  { href: "/analytics", label: ui.mainmenu.analytics, icon: RiBarChart2Fill },
  { href: "/inventory", label: ui.mainmenu.warehouse, icon: RiHome6Fill },
];

const iconSize = { width: "24px", height: "24px" };

export default function Header({
  themeToggler,
  theme,
}: {
  themeToggler: () => void;
  theme: string;
}) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return (
    <header className="flex justify-between items-center space-x-4 p-2 bg-zinc-900 text-white">
      <nav className="flex space-x-2">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`text-white ${clsx(
              buttonVariants({ variant: "link" }),
              pathname === href && "bg-zinc-800"
            )}`}
          >
            <Icon style={iconSize} />{" "}
            <span className="hidden md:block">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center space-x-2">
        <Button
          variant="link"
          onClick={themeToggler}
          className="text-white hover:opacity-75 transition-opacity duration-300"
        >
          {theme === "dark" ? (
            <RiSunFill style={iconSize} />
          ) : (
            <RiMoonFill style={iconSize} />
          )}
        </Button>
        <Button
          variant="link"
          onClick={handleLogout}
          className="text-white hover:opacity-75 transition-opacity duration-300"
        >
          <RiLogoutBoxRFill style={iconSize} />
        </Button>
      </div>
    </header>
  );
}
