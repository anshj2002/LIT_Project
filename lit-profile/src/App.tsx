import { Routes, Route, NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import Profile from "./pages/Profile"
import Admin from "./pages/Admin"
import ProfilesIndex from "./pages/ProfilesIndex"
import AdminStudent from "./pages/AdminStudent"

export default function App() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  )
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <div className="min-h-screen">
      <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" className={({isActive}) => `font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              Profile
            </NavLink>
            <NavLink to="/profiles" className={({isActive}) => `font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              Profiles
            </NavLink>
            <NavLink to="/admin" className={({isActive}) => `font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              Admin
            </NavLink>
          </nav>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </header>
      <main className="container py-6">
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/profiles" element={<ProfilesIndex />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/:studentId" element={<AdminStudent />} />
        </Routes>
      </main>
    </div>
  )
}
