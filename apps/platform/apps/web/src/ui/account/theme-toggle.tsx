"use client";

import { cn } from "@leadswap/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
  { value: "light", label: "Clair", icon: Sun },
  { value: "dark", label: "Sombre", icon: Moon },
  { value: "system", label: "Système", icon: Monitor },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-default">
        <div className="flex flex-col space-y-3 p-5 sm:p-10">
          <h2 className="text-xl font-medium text-content-emphasis">
            Apparence
          </h2>
          <p className="text-sm text-content-subtle">
            Choisissez le thème de l&apos;interface.
          </p>
        </div>
        <div className="border-b border-border-default" />
        <div className="flex items-center justify-between p-3 sm:px-10">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-bg-subtle" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-default bg-bg-default">
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="text-xl font-medium text-content-emphasis">Apparence</h2>
        <p className="text-sm text-content-subtle">
          Choisissez le thème de l&apos;interface.
        </p>
      </div>
      <div className="border-b border-border-default" />
      <div className="flex items-center justify-between p-3 sm:px-10">
        <div className="flex items-center gap-1 rounded-lg border border-border-default bg-bg-subtle p-1">
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
                theme === value
                  ? "bg-bg-default text-content-emphasis shadow-sm"
                  : "text-content-subtle hover:text-content-default"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

