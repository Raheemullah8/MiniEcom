"use client";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

function Searchbar({ search, setSearch }: { search: string; setSearch: (value: string) => void }) {
  // 👇 Ye sirf input field ke liye hai (real-time update)
  const [inputValue, setInputValue] = useState(search);

  // 👇 Debounce logic: jab user ruk jaye to hi search call ho
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue); // 500ms baad actual search update
    }, 500);

    // 👇 Har naye input pe purana timer cancel
    return () => clearTimeout(timer);
    
  }, [inputValue]);
  return (
    <div className="mb-6 max-w-md">
      <Input
        type="text"
        placeholder="Search products..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} // Real-time input
        className="border border-gray-300 shadow-sm"
      />
    </div>
  );
}

export default Searchbar;
