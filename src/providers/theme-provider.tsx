import { useEffect, type ReactNode } from "react"
import { useAppSelector } from "@/redux/hooks"
import type { Theme } from "@/redux/features/ui/ui-slice"

interface ThemeProviderProps {
  children: ReactNode
}

const resolveTheme = (theme: Theme): "light" | "dark" =>
  theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    : theme

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useAppSelector((s) => s.ui?.theme ?? "system")

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    const resolved = resolveTheme(theme)
    root.classList.add(resolved)
  }, [theme])

  return <>{children}</>
}
