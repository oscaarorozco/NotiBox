"use client";

import {
  Book,
  Home,
  LineChart,
  PanelLeft,
  Search,
  Settings,
  Folder,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useContentStore } from "@/hooks/use-content-store.tsx";

export function Header() {
  const pathname = usePathname();
  const { setSearchQuery } = useContentStore();
  
  const pageTranslations: {[key: string]: string} = {
    'dashboard': 'Inicio',
    'stats': 'Estadísticas',
    'settings': 'Ajustes',
  }
  
  const pathParts = pathname.split("/").filter(Boolean);
  const currentPage = pathParts[pathParts.length - 1] || 'dashboard';
  const pageName = pageTranslations[currentPage] || "Panel";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/80 bg-background/80 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Abrir Menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Book className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Central de Contenido</span>
            </Link>
            <Link
              href="/dashboard"
              className={`flex items-center gap-4 px-2.5 ${
                pathname === "/dashboard"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home className="h-5 w-5" />
              Inicio
            </Link>
            <Link
              href="/dashboard/stats"
              className={`flex items-center gap-4 px-2.5 ${
                pathname === "/dashboard/stats"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LineChart className="h-5 w-5" />
              Estadísticas
            </Link>
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-4 px-2.5 ${
                pathname === "/dashboard/settings"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="h-5 w-5" />
              Ajustes
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Folder className="h-4 w-4"/>
                Panel
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize font-headline text-foreground">
              {pageName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        {pathname === "/dashboard" && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar contenido..."
              className="w-full rounded-full bg-secondary pl-9 md:w-[200px] lg:w-[330px]"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
