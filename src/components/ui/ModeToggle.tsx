import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ui/ThemeProvider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="link"
      size="icon"
      className="hover:scale-110"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Moon />
      ) : (
        <Sun />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}