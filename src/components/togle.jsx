"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme(); // 'theme' ki jagah 'resolvedTheme' use karein
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-10 w-10" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-border bg-background shadow-md hover:bg-accent transition-all duration-300"
        >
          {/* Resolved Theme ke basis par icons toggle honge */}
          {resolvedTheme === "dark" ? (
            <Moon className="h-5 w-5 text-blue-400 transition-all" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-500 transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-36 rounded-xl shadow-xl border border-border bg-popover"
      >
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
          ☀️ Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
          🌙 Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
          💻 System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}