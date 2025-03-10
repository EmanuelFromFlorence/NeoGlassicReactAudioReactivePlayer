import React from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  theme: "neomorphic" | "glassmorphic";
  onToggle: () => void;
}

const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <Button
      onClick={onToggle}
      variant="ghost"
      size="icon"
      className={`absolute top-4 right-4 z-20 rounded-full w-10 h-10 ${
        theme === "neomorphic"
          ? "bg-white bg-opacity-10 shadow-[0_4px_8px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.1)]"
          : "bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-20"
      }`}
    >
      {theme === "neomorphic" ? (
        <Sun className="h-5 w-5 text-white" />
      ) : (
        <Moon className="h-5 w-5 text-white" />
      )}
    </Button>
  );
};

export default ThemeToggle;
