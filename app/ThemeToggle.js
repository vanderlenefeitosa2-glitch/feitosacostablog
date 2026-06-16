"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const current =
      document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label="Alternar tema claro/escuro"
      title="Alternar tema claro/escuro"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
