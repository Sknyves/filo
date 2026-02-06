"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const root = document.documentElement;
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme && savedTheme !== theme) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTheme(savedTheme);
        }
        root.classList.toggle("dark", (savedTheme || theme) === "dark");
        setMounted(true);
    }, [theme]);

    if (!mounted) return null;

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-6 right-6 z-50 p-3 rounded-full glass hover:scale-110 transition-transform shadow-xl"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? (
                <Sun size={20} className="text-yellow-400" />
            ) : (
                <Moon size={20} className="text-blue-600" />
            )}
        </button>
    );
}
