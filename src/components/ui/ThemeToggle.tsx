"use client";

import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Light/dark toggle. Flips the `.dark` class on <html> and persists the
 * choice to localStorage. The matching no-FOUC init script in the root
 * layout applies the stored (or system) preference before first paint, so
 * there's no flash and no hydration mismatch — the icon is swapped purely
 * with `dark:` CSS variants rather than React state.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    root.style.colorScheme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* private mode / storage disabled — ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle theme"
      className={cn(
        "grid h-10 w-10 place-items-center rounded-lg text-fg transition-colors hover:bg-surface-2",
        className
      )}
    >
      <Moon className="h-5 w-5 dark:hidden" />
      <Sun className="hidden h-5 w-5 dark:block" />
    </button>
  );
}
