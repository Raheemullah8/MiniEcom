"use client";
import React from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "raheem2112a@aptechsite.net";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    router.push("/");
    return null;
  }

  // Check if the logged-in user has the admin email
  if (user?.emailAddresses?.[0]?.emailAddress !== ADMIN_EMAIL) {
    router.push("/");
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="flex min-h-screen">
        {/* Mobile Header */}
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
          <div className="ml-auto mr-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Desktop Sidebar */}
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
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                    userButtonAvatarBox: "h-full w-full"
                  }
                }}
              />
              {!isMobile && <div className="text-lg font-semibold">Admin Panel</div>}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2">
            <DropdownMenuItem className="cursor-pointer">
              <UserButton afterSignOutUrl="/" />
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