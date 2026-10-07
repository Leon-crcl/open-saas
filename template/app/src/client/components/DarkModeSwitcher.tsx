import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useColorMode } from "../hooks/useColorMode";

export function DarkModeSwitcher() {
  const [colorMode, setColorMode] = useColorMode();
  const isInLightMode = colorMode === "light";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={
        isInLightMode ? "Switch to dark mode" : "Switch to light mode"
      }
      onClick={() => {
        if (typeof setColorMode === "function") {
          setColorMode(isInLightMode ? "dark" : "light");
        }
      }}
    >
      {isInLightMode ? <Moon /> : <Sun />}
    </Button>
  );
}
