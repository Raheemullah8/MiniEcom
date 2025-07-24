"use client";
import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeProvider } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react"; // hamburger icon

const user = {
  name: "Admin",
  email: "admin@example.com",
  image: "",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="flex min-h-screen">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-background border-b border-muted flex items-center justify-between px-4 py-2">
          <Sheet>
            <SheetTrigger>
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-5">
              <SidebarContent isMobile />
            </SheetContent>
          </Sheet>
          <div className="text-lg font-semibold">Admin Panel</div>
        </div>

        {/* Sidebar for Desktop */}
        <aside className="hidden md:block w-64 bg-background text-foreground border-r border-muted p-5 shadow-sm">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-background text-foreground overflow-y-auto mt-12 md:mt-0">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}

function SidebarContent({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <div className={`flex items-center gap-3 mb-8 ${isMobile ? "mt-4" : ""}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.image} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              {!isMobile && <div className="text-lg font-semibold">Admin Panel</div>}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 mt-2">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <DropdownMenuItem
              onClick={() => {
                console.log("Logout Clicked");
              }}
              className="cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="space-y-2 text-sm">
        <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-muted">
          Dashboard
        </Link>
        <Link href="/dashboard/add" className="block px-3 py-2 rounded hover:bg-muted">
          Add Product
        </Link>
        <Link href="/dashboard/users" className="block px-3 py-2 rounded hover:bg-muted">
          All-Users
        </Link>
        <Link href="/" className="block px-3 py-2 rounded hover:bg-muted">
          Back to Home
        </Link>
      </nav>

      <Separator className="my-6" />

      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Mini Ecom</p>
    </>
  );
}
