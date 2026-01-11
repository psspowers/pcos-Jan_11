"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useLayoutEffect, useState, useCallback, useMemo } from "react"
import { ThemeProviderProps } from "next-themes/dist/types"

type Theme = "dark" | "light" | "system"

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  value: _value,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme")
      console.log('[ThemeProvider] Initial load - savedTheme:', savedTheme, 'defaultTheme:', defaultTheme)
      const initialTheme = (savedTheme && (savedTheme === "dark" || savedTheme === "light" || savedTheme === "system")
        ? savedTheme
        : defaultTheme) as Theme
      console.log('[ThemeProvider] Initial theme set to:', initialTheme)
      return initialTheme
    }
    return defaultTheme as Theme
  })

  useLayoutEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      console.log('[ThemeProvider] System theme detected:', systemTheme)
      root.classList.add(systemTheme)
      return
    }

    console.log('[ThemeProvider] Applying theme:', theme)
    console.log('[ThemeProvider] HTML classes before:', root.className)
    root.classList.add(theme)
    console.log('[ThemeProvider] HTML classes after:', root.className)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    console.log('[ThemeProvider] setTheme called with:', newTheme)
    console.log('[ThemeProvider] Current theme:', theme)
    localStorage.setItem("theme", newTheme)
    console.log('[ThemeProvider] LocalStorage updated:', localStorage.getItem('theme'))
    setThemeState(newTheme)
  }, [theme])

  const value = useMemo<ThemeContextType>(() => ({
    theme,
    setTheme,
  }), [theme, setTheme])

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
