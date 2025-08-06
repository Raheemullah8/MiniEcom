// components/Header.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Search, 
  ShoppingCart,
  Menu,
  X
} from "lucide-react";
import ClerkHeader from './ClerkHeader';

interface HeaderProps {
  notificationCount?: number;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function Header({
  notificationCount = 3,
  onSearch = (query) => console.log("Search:", query),
  searchQuery = "",
  setSearchQuery = () => {}
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    if (showMobileSearch) setShowMobileSearch(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">Shop</span>
          </div>
        </div>

        {/* Search Bar - Center (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full"
            />
          </form>
        </div>

        {/* Right Section - Icons & User */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search size={20} />
          </Button>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="icon">
              <ShoppingCart size={20} />
            </Button>
          </div>

          {/* User Auth */}
          <ClerkHeader />
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden p-3 border-t">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full"
            />
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="px-4 py-3 space-y-3">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Bell size={18} />
                Notifications
                {notificationCount > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
              
              <Button variant="ghost" className="w-full justify-start gap-2">
                <ShoppingCart size={18} />
                Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}