// app/layout.tsx
"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import { useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ClerkProvider,
 
} from '@clerk/nextjs'
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Create Search Context
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // If not on homepage, redirect to homepage with search
    if (pathname !== '/') {
      router.push(`/?search=${encodeURIComponent(query)}`);
    }
  };

  // Handle login
  const handleLogin = () => {
    router.push('/login'); // Adjust this to your login route
  };

  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem('token'); // Example
    router.push('/login'); // Redirect to login
  };

  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute={"class"}
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
            <Header 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              notificationCount={3}
            />
            {children}
            <Toaster />
            <Footer/>
          </SearchContext.Provider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}