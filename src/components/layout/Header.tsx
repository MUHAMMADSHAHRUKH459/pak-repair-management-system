"use client";

import { Bell, Search, Moon, Sun, Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Hamburger - mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center"
        >
          <Menu className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h2 className="text-base lg:text-lg font-semibold text-slate-800 dark:text-white">
            {title}
          </h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            {new Date().toLocaleDateString("en-PK", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Search - hidden on small screens */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 rounded-lg border-0 outline-none focus:ring-2 focus:ring-blue-500 w-48 text-slate-700 dark:text-white placeholder:text-slate-400"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-yellow-500" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
          <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}