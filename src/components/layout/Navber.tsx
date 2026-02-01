"use client";

import { Menu, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Accordion,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { useRouter } from "next/navigation";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
  isAuthenticated?: boolean;
  dashboardUrl?: string;
  onLogout?: () => void;
}

const Navbar = ({
  logo = {
    url: "/",
    src: "https://unpkg.com/heroicons@2.0.18/24/solid/sparkles.svg",
    alt: "logo",
    title: "FoodHub",
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "Categories", url: "/categories" },
    { title: "Providers", url: "/providers" },
    { title: "Meals", url: "/meals" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/register" },
  },
  isAuthenticated = false,
  dashboardUrl = "/dashboard",
  onLogout,
  className,
}: Navbar1Props) => {
  const router = useRouter();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
    router.push("/");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur",
        className
      )}
    >
      <div className="container mx-auto px-4">
        {/* Desktop */}
        <nav className="hidden h-16 items-center justify-between lg:flex">
          {/* Left */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-8 w-8 dark:invert"
              />
              <span className="text-xl font-bold tracking-tight">
                {logo.title}
              </span>
            </Link>

            {/* Menu */}
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {menu.map(renderMenuItem)}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            {isAuthenticated ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href={dashboardUrl}>Dashboard</Link>
                </Button>

                <Button
                  onClick={handleLogout}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Link href={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile */}
        <div className="flex h-16 items-center justify-between lg:hidden">
          <Link href={logo.url} className="flex items-center gap-2">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-8 w-8 dark:invert"
            />
            <span className="text-lg font-semibold">{logo.title}</span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-6 w-6 dark:invert"
                  />
                  <span>{logo.title}</span>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-6">
                {/* Menu */}
                <div className="flex flex-col gap-3">
                  {menu.map(renderMobileMenuItem)}
                </div>

                <div className="border-t pt-4 flex flex-col gap-3">
                  {isAuthenticated ? (
                    <>
                      <Button asChild variant="outline">
                        <Link href={dashboardUrl}>Dashboard</Link>
                      </Button>

                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline">
                        <Link href={auth.login.url}>{auth.login.title}</Link>
                      </Button>

                      <Button
                        asChild
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <Link href={auth.signup.url}>{auth.signup.title}</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

const renderMenuItem = (item: MenuItem) => (
  <NavigationMenuItem key={item.title}>
    <NavigationMenuLink
      asChild
      className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted  "
    >
      <Link href={item.url}>{item.title}</Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
);

const renderMobileMenuItem = (item: MenuItem) => (
  <Link
    key={item.title}
    href={item.url}
    className="text-base font-medium hover:text-orange-600"
  >
    {item.title}
  </Link>
);

export { Navbar };