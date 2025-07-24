"use client";
import React from "react";
import { Input } from "./ui/input";

function Searchbar({ search, setSearch }: { search: string; setSearch: (value: string) => void }) {
  return (
    <div className="mb-6 max-w-md">
      <Input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 shadow-sm"
      />
    </div>
  );
}

export default Searchbar;
