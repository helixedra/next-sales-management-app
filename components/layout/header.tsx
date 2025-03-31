"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  RiBox3Fill,
  RiBarChart2Fill,
  RiHome6Fill,
  RiGroup3Fill,
  RiBox2Fill,
  RiFolderOpenFill,
  RiLogoutBoxRFill,
  RiUser6Fill,
  RiMoonFill,
  RiSunFill,
  RiAccountCircleFill,
} from "react-icons/ri";
import { Button, buttonVariants } from "@/components/ui/button";
import ui from "@/app/data/ui.json";
import clsx from "clsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: ui.mainmenu.sales, icon: RiBox3Fill },
  { href: "/analytics", label: ui.mainmenu.analytics, icon: RiBarChart2Fill },
  { href: "/inventory", label: ui.mainmenu.warehouse, icon: RiHome6Fill },
  { href: "/customers", label: ui.mainmenu.customers, icon: RiGroup3Fill },
  { href: "/delivery", label: ui.mainmenu.delivery, icon: RiBox2Fill },
  { href: "/files", label: ui.mainmenu.files, icon: RiFolderOpenFill },
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
    <header className="flex justify-between items-center space-x-4 p-2 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white border-b border-zinc-200/50 dark:border-zinc-800">
      <nav className="flex space-x-2">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`text-black dark:text-white ${clsx(
              buttonVariants({ variant: "link" }),
              pathname === href && "bg-zinc-200 dark:bg-zinc-800"
            )}`}
          >
            <Icon style={iconSize} />{" "}
            <span className="hidden md:block">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center space-x-2 pr-2">
        <Button
          variant="link"
          onClick={themeToggler}
          className="text-black dark:text-white hover:opacity-75 transition-opacity duration-300"
        >
          {theme === "dark" ? (
            <RiSunFill size={18} />
          ) : (
            <RiMoonFill size={18} />
          )}
        </Button>
        {/* <Popover>
          <PopoverTrigger>
            <div className="text-black dark:text-white bg-zinc-300 dark:bg-zinc-600 w-8 h-8 rounded-full hover:opacity-75 transition-opacity duration-300">
              <span className="text-xs font-bold">AF</span>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            {" "}
            <Button
              variant="link"
              onClick={handleLogout}
              className="text-black dark:text-white bg-zinc-300 dark:bg-zinc-600 w-8 h-8 rounded-full hover:opacity-75 transition-opacity duration-300"
            >
              logout
            </Button>
          </PopoverContent>
        </Popover> */}
        <DropdownMenuAccount logout={handleLogout} />
      </div>
    </header>
  );
}

export function DropdownMenuAccount({ logout }: { logout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-center text-black dark:text-white bg-zinc-300 dark:bg-zinc-600 w-8 h-8 rounded-full hover:opacity-75 transition-opacity duration-300 cursor-pointer">
          <span className="text-xs font-bold">AF</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 border-zinc-200 dark:border-zinc-800"
        align="end"
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LifeBuoy />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
